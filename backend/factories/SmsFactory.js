const NotificacaoFactory = require('./NotificacaoFactory');
const SmsNotificacao = require('../products/SmsNotificacao');

class SmsFactory extends NotificacaoFactory {
  criarNotificacao() {
    return new SmsNotificacao();
  }
}

module.exports = SmsFactory;
