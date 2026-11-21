import { Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type ConnectionState,
  type WAMessage,
  type WASocket,
} from '@whiskeysockets/baileys';
import * as qrcode from 'qrcode-terminal';
import { WhatsappCommandService } from './whatsapp-command.service';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpenseMessageParser } from './expense-message-parser';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private sock: WASocket | null = null;

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly commandService: WhatsappCommandService,
  ) {}

  get isEnabled(): boolean {
    return process.env.WHATSAPP_ENABLED === 'true';
  }

  async onModuleInit() {
    if (!this.isEnabled) {
      console.log(
        '📴 WhatsApp desativado (defina WHATSAPP_ENABLED=true para ativar).',
      );
      return;
    }

    await this.connect();
  }

  private async connect() {
    if (!this.isEnabled) return;

    const { state, saveCreds } = await useMultiFileAuthState('auth');

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    this.registerConnectionEvents(saveCreds);
    this.registerMessageEvents();

    console.log('📲 WhatsApp bot iniciado');
  }

  private registerConnectionEvents(saveCreds: () => Promise<void>) {
    const sock = this.sock;

    if (!sock) return;

    sock.ev.on('creds.update', () => {
      void saveCreds();
    });

    sock.ev.on('connection.update', (update) => {
      void this.handleConnectionUpdate(update);
    });
  }

  private async handleConnectionUpdate(update: Partial<ConnectionState>) {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      console.log('📲 Escaneie o QR Code abaixo com seu WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!');
    }

    if (connection === 'close') {
      const statusCode = this.getDisconnectStatusCode(lastDisconnect);

      console.log('❌ Conexão com WhatsApp fechada.');

      if (statusCode === DisconnectReason.loggedOut) {
        console.log(
          '🚪 Sessão encerrada. Apague a pasta auth e escaneie novamente.',
        );
        return;
      }

      console.log('🔄 Reconectando ao WhatsApp...');
      await this.connect();
    }
  }

  private getDisconnectStatusCode(
    lastDisconnect: Partial<ConnectionState>['lastDisconnect'],
  ): number | undefined {
    const error = lastDisconnect?.error;

    if (!error || typeof error !== 'object' || !('output' in error)) {
      return undefined;
    }

    const output = (error as { output?: { statusCode?: number } }).output;

    return output?.statusCode;
  }

  private registerMessageEvents() {
    const sock = this.sock;

    if (!sock) return;

    sock.ev.on('messages.upsert', ({ messages, type }) => {
      if (type !== 'notify') return;

      const message = messages[0];

      if (!message) return;

      void this.handleIncomingMessage(message);
    });
  }

  private async handleIncomingMessage(message: WAMessage) {
    if (!message.message) return;

    if (message.key.fromMe) return;

    const chatId = message.key.remoteJid;

    if (!chatId) return;

    if (process.env.BOT_GROUP_ID && chatId !== process.env.BOT_GROUP_ID) {
      return;
    }

    const receivedText = this.extractText(message);

    if (!receivedText) return;

    console.log('==========================');
    console.log('Chat:', chatId);
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

    const parsed = this.parseExpense(receivedText);

    if (!parsed) {
      await this.sendMessage(chatId, '❌ Formato inválido. Use: mercado 120');
      return;
    }

    const expense = await this.expensesService.create(parsed);

    await this.sendMessage(
      chatId,
      `${expense.type === 'income' ? '✅ Receita registrada!' : '✅ Gasto registrado!'}

      📌 ${expense.description}
      📂 ${expense.category}
      💰 R$ ${expense.value}`,
    );
  }

  private extractText(message: WAMessage): string | null {
    return (
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      message.message?.imageMessage?.caption ||
      message.message?.videoMessage?.caption ||
      null
    );
  }

  private async handleHelpCommand(chatId: string) {
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

  async sendMessage(to: string, message: string) {
    if (!this.isEnabled || !this.sock) {
      console.log('📴 WhatsApp desativado; mensagem não enviada.');
      return;
    }

    await this.sock.sendMessage(to, { text: message });
  }
}
