const Notificacao = require('./Notificacao');

/**
 * Implementação de Push para cumprir o desafio do laboratório.
 * Neste projeto a entrega é registrada como notificação interna; a entrega
 * nativa no navegador é feita pelo front-end com a Web Notification API.
 */
class PushNotificacao extends Notificacao {
  async enviar(destinatario, mensagem) {
    return {
      sucesso: true,
      canal: 'push',
      destinatario,
      mensagem: mensagem.texto,
      observacao: 'Push preparado; a exibição nativa ocorre no navegador autenticado.'
    };
  }
}

module.exports = PushNotificacao;
