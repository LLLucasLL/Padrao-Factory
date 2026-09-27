/**
 * Factory Method.
 * A fábrica conhece o contrato Notificacao, mas a classe concreta decide
 * qual produto será instanciado no método criarNotificacao().
 */
class NotificacaoFactory {
  criarNotificacao() {
    throw new Error('O método criarNotificacao() deve ser implementado pela fábrica concreta.');
  }

  async enviarMensagem(destinatario, mensagem) {
    const notificacao = this.criarNotificacao();
    return notificacao.enviar(destinatario, mensagem);
  }
}

module.exports = NotificacaoFactory;
