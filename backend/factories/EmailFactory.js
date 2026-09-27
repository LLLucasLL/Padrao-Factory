const NotificacaoFactory = require('./NotificacaoFactory');
const EmailNotificacao = require('../products/EmailNotificacao');

class EmailFactory extends NotificacaoFactory {
  criarNotificacao() {
    return new EmailNotificacao();
  }
}

module.exports = EmailFactory;
