import { Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import * as qrcode from 'qrcode-terminal';
import { WhatsappCommandService } from './whatsapp-command.service';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpenseMessageParser } from './expense-message-parser';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private sock: any;

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly commandService: WhatsappCommandService
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
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
    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', async (update: any) => {
      const { connection, qr, lastDisconnect } = update;

      if (qr) {
        console.log('📲 Escaneie o QR Code abaixo com seu WhatsApp:');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'open') {
        console.log('✅ WhatsApp conectado com sucesso!');
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        console.log('❌ Conexão com WhatsApp fechada.');

        if (statusCode === DisconnectReason.loggedOut) {
          console.log('🚪 Sessão encerrada. Apague a pasta auth e escaneie novamente.');
          return;
        }

        console.log('🔄 Reconectando ao WhatsApp...');
        await this.connect();
      }
    });
  }

  private registerMessageEvents() {
    this.sock.ev.on('messages.upsert', async ({ messages, type }: any) => {
      if (type !== 'notify') return;

      const message = messages[0];

      await this.handleIncomingMessage(message);
    });
  }

  private async handleIncomingMessage(message: any) {
    if (!message?.message) return;

    if (message.key.fromMe) return;

    const chatId = message.key.remoteJid;

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

  private extractText(message: any): string | null {
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
    await this.sock.sendMessage(to, { text: message });
  }
}