const path = require('path');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

let socket;
let inicializacao;
let ultimoQr;
let ultimoQrEm = 0;

function normalizarNumero(numero) {
  return String(numero || '').replace(/\D/g, '');
}

async function iniciar() {
  if (socket) return socket;
  if (inicializacao) return inicializacao;

  inicializacao = (async () => {
    const {
      default: makeWASocket,
      DisconnectReason,
      useMultiFileAuthState
    } = await import('@whiskeysockets/baileys');
    const pastaAuth = path.resolve(process.env.WHATSAPP_AUTH_DIR || '.baileys-auth');
    const { state, saveCreds } = await useMultiFileAuthState(pastaAuth);

    socket = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false
    });

    socket.ev.on('creds.update', saveCreds);
    socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        const agora = Date.now();
        if (qr === ultimoQr || agora - ultimoQrEm < 15000) return;
        ultimoQr = qr;
        ultimoQrEm = agora;
        console.log('\nEscaneie este QR Code no WhatsApp para conectar:');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'open') {
        ultimoQr = undefined;
        ultimoQrEm = 0;
        console.log('WhatsApp conectado pelo Baileys.');
      }

      if (connection === 'close') {
        socket = undefined;
        inicializacao = undefined;
        const codigo = lastDisconnect?.error?.output?.statusCode;
        if (codigo !== DisconnectReason.loggedOut) {
          setTimeout(() => {
            iniciar().catch((erro) => console.error('Erro ao reconectar WhatsApp:', erro.message));
          }, 3000);
        }
      }
    });

    return socket;
  })();

  try {
    return await inicializacao;
  } catch (erro) {
    socket = undefined;
    inicializacao = undefined;
    throw erro;
  }
}

async function enviarWhatsApp(destinatario, texto) {
  const numero = normalizarNumero(destinatario);
  if (!/^\d{10,15}$/.test(numero)) {
    throw new Error('O número de destino do WhatsApp é inválido.');
  }

  const cliente = await iniciar();
  const resposta = await cliente.sendMessage(`${numero}@s.whatsapp.net`, { text: texto });
  return { messageId: resposta.key.id };
}

module.exports = { enviarWhatsApp };