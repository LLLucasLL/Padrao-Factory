const NotificacaoFactory = require('./NotificacaoFactory');
const TelegramNotificacao = require('../products/TelegramNotificacao');

class TelegramFactory extends NotificacaoFactory {
  criarNotificacao() {
    return new TelegramNotificacao();
  }
}

module.exports = TelegramFactory;
