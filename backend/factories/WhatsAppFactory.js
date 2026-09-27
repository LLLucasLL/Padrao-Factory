const NotificacaoFactory = require('./NotificacaoFactory');
const WhatsAppNotificacao = require('../products/WhatsAppNotificacao');

class WhatsAppFactory extends NotificacaoFactory {
  criarNotificacao() {
    return new WhatsAppNotificacao();
  }
}

module.exports = WhatsAppFactory;
