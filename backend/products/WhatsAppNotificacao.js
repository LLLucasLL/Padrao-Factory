const Notificacao = require('./Notificacao');
const { enviarWhatsApp } = require('../config/whatsapp');

class WhatsAppNotificacao extends Notificacao {
  async enviar(destinatario, mensagem) {
    const resposta = await enviarWhatsApp(destinatario, mensagem.texto);
    const id = resposta.messageId || resposta.messages?.[0]?.messageId;

    return { sucesso: true, canal: 'whatsapp', destinatario, id };
  }
}

module.exports = WhatsAppNotificacao;
