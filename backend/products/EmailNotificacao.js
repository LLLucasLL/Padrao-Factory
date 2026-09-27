const Notificacao = require('./Notificacao');
const transporter = require('../config/email');

class EmailNotificacao extends Notificacao {
  async enviar(destinatario, mensagem) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: destinatario,
      subject: mensagem.assunto,
      text: mensagem.texto
    });

    return { sucesso: true, canal: 'email', destinatario };
  }
}

module.exports = EmailNotificacao;
