const NotificacaoFactory = require('./NotificacaoFactory');
const PushNotificacao = require('../products/PushNotificacao');

class PushFactory extends NotificacaoFactory {
  criarNotificacao() {
    return new PushNotificacao();
  }
}

module.exports = PushFactory;
