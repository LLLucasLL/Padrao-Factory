const Notificacao = require('./Notificacao');
const { enviarSms } = require('../config/infobip');

class SmsNotificacao extends Notificacao {
  async enviar(destinatario, mensagem) {
    const resposta = await enviarSms(destinatario, mensagem.texto);
    const id = resposta.messages?.[0]?.messageId;

    return { sucesso: true, canal: 'sms', destinatario, id };
  }
}

module.exports = SmsNotificacao;
