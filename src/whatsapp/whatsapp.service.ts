import { Boom } from '@hapi/boom';
import { Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type BaileysEventMap,
  type WASocket,
  type WAMessage,
} from '@whiskeysockets/baileys';
import qrcodeTerminal from 'qrcode-terminal';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpenseMessageParser } from './expense-message-parser';
import { WhatsappCommandService } from './whatsapp-command.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private sock?: WASocket;

  private saveCredentials?: () => Promise<void>;

  private readonly allowedChats: string[];

  private readonly botMessageIds = new Set<string>();

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly commandService: WhatsappCommandService,
  ) {
    this.allowedChats = this.loadAllowedChats();
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  private loadAllowedChats(): string[] {
    const configuredChats = process.env.WHATSAPP_ALLOWED_CHATS;

    if (!configuredChats) {
      console.warn(
        '⚠️ WHATSAPP_ALLOWED_CHATS não foi configurado. Nenhuma mensagem será processada.',
      );

      return [];
    }

    return configuredChats
      .split(',')
      .map((chatId) => chatId.trim())
      .filter((chatId) => chatId.length > 0);
  }

  private async connect(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    this.saveCredentials = saveCreds;

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    this.registerConnectionEvents();
    this.registerMessageEvents();

    console.log('📲 WhatsApp bot iniciado');

    console.log(
      `🔒 Chats autorizados: ${
        this.allowedChats.length > 0 ? this.allowedChats.join(', ') : 'nenhum'
      }`,
    );
  }

  private registerConnectionEvents(): void {
    if (!this.sock) {
      return;
    }

    this.sock.ev.on('creds.update', () => {
      void this.saveCredentials?.();
    });

    this.sock.ev.on('connection.update', (update) => {
      void this.handleConnectionUpdate(update);
    });
  }

  private async handleConnectionUpdate(
    update: BaileysEventMap['connection.update'],
  ): Promise<void> {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📲 Escaneie o QR Code abaixo com seu WhatsApp:');

      type QrCodeTerminal = {
        generate(
          qr: string,
          options: {
            small: boolean;
          },
        ): void;
      };

      const qrcode = qrcodeTerminal as QrCodeTerminal;

      qrcode.generate(qr, {
        small: true,
      });
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!');
      return;
    }

    if (connection !== 'close') {
      return;
    }

    const statusCode =
      lastDisconnect?.error instanceof Boom
        ? lastDisconnect.error.output.statusCode
        : undefined;

    if (statusCode === DisconnectReason.loggedOut) {
      console.log(
        '🚪 Sessão encerrada. Apague a pasta auth e escaneie novamente.',
      );

      return;
    }

    console.log('🔄 Reconectando ao WhatsApp...');

    await this.connect();
  }

  private registerMessageEvents(): void {
    if (!this.sock) {
      return;
    }

    this.sock.ev.on('messages.upsert', (event) => {
      void this.handleMessagesUpsert(event);
    });
  }

  private async handleMessagesUpsert(
    event: BaileysEventMap['messages.upsert'],
  ): Promise<void> {
    for (const message of event.messages) {
      await this.handleIncomingMessage(message);
    }
  }

  private async handleIncomingMessage(message: WAMessage): Promise<void> {
    if (!message.message) {
      return;
    }

    const messageId = message.key.id;

    /*
     * Ignora mensagens enviadas pelo próprio bot.
     */
    if (messageId && this.botMessageIds.has(messageId)) {
      this.botMessageIds.delete(messageId);

      console.log('↩️ Resposta enviada pelo FinAI ignorada.');

      return;
    }

    const chatId = message.key.remoteJid;

    if (!chatId) {
      return;
    }

    if (chatId === 'status@broadcast') {
      return;
    }

    if (!this.allowedChats.includes(chatId)) {
      return;
    }

    const receivedText = this.extractText(message);

    if (!receivedText) {
      return;
    }

    /*
     * Proteção adicional contra respostas antigas do bot.
     */
    if (
      receivedText.startsWith('🤖 FinAI') ||
      receivedText.includes('✅ Gasto registrado!') ||
      receivedText.includes('✅ Receita registrada!')
    ) {
      console.log('↩️ Mensagem de resposta do bot ignorada.');
      return;
    }

    console.log('==========================');
    console.log('✅ Chat autorizado:', chatId);
    console.log('Enviada por mim:', message.key.fromMe ? 'SIM' : 'NÃO');
    console.log('Mensagem:', receivedText);
    console.log('==========================');

    const command = receivedText.trim().toLowerCase();

    if (command === 'ajuda') {
      await this.handleHelpCommand(chatId);
      return;
    }

    const commandResponse = await this.commandService.handle(command);

    if (commandResponse) {
      await this.sendMessage(chatId, commandResponse);
      return;
    }

    const parsedExpense = this.parseExpense(receivedText);

    if (!parsedExpense) {
      await this.sendMessage(chatId, '❌ Formato inválido. Use: mercado 120');

      return;
    }

    const expense = await this.expensesService.create(parsedExpense);

    const formattedValue = Number(expense.value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    await this.sendMessage(
      chatId,
      `${
        expense.type === 'income'
          ? '✅ Receita registrada!'
          : '✅ Gasto registrado!'
      }

📌 ${expense.description}
📂 ${expense.category}
💰 R$ ${formattedValue}`,
    );
  }

  private async handleGroupMessage(
    chatId: string,
    message: WAMessage,
  ): Promise<void> {
    if (!this.sock) {
      return;
    }

    const receivedText = this.extractText(message);

    try {
      const groupMetadata = await this.sock.groupMetadata(chatId);

      const isAuthorized = this.allowedChats.includes(chatId);

      console.log('');
      console.log('==============================================');
      console.log('👥 GRUPO ENCONTRADO');
      console.log(`📌 Nome: ${groupMetadata.subject}`);
      console.log(`🆔 ID: ${chatId}`);
      console.log(`🔒 Autorizado: ${isAuthorized ? 'SIM' : 'NÃO'}`);

      if (receivedText) {
        console.log(`💬 Mensagem: ${receivedText}`);
      }

      console.log('==============================================');
      console.log('');
    } catch (error) {
      console.error(
        `❌ Não foi possível consultar os dados do grupo ${chatId}.`,
        error instanceof Error ? error.message : String(error),
      );

      console.log('');
      console.log('==============================================');
      console.log('👥 GRUPO ENCONTRADO');
      console.log(`🆔 ID: ${chatId}`);

      if (receivedText) {
        console.log(`💬 Mensagem: ${receivedText}`);
      }

      console.log('==============================================');
      console.log('');
    }
  }

  private extractText(message: WAMessage): string | null {
    return (
      message.message?.conversation ??
      message.message?.extendedTextMessage?.text ??
      message.message?.imageMessage?.caption ??
      message.message?.videoMessage?.caption ??
      null
    );
  }

  private async handleHelpCommand(chatId: string): Promise<void> {
    await this.sendMessage(
      chatId,
      `🤖 *Comandos disponíveis:*

💸 Registrar gasto:
Ex: mercado 120
Ex: uber 25
Ex: ifood 39.90

📊 Relatórios:
hoje
semana
mes
saldo

🆘 ajuda`,
    );
  }

  private parseExpense(text: string) {
    return ExpenseMessageParser.parse(text);
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.sock) {
      throw new Error('WhatsApp não está conectado.');
    }

    const sentMessage = await this.sock.sendMessage(to, {
      text: `🤖 FinAI\n${message}`,
    });

    const messageId = sentMessage?.key.id;

    if (messageId) {
      this.botMessageIds.add(messageId);

      /*
       * Evita que IDs permaneçam indefinidamente na memória.
       */
      setTimeout(() => {
        this.botMessageIds.delete(messageId);
      }, 60_000);
    }
  }
}
