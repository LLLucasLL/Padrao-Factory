/**
 * Produto abstrato do Factory Method.
 * No JavaScript usamos uma classe base para representar o contrato.
 */
class Notificacao {
  async enviar(_destinatario, _mensagem) {
    throw new Error('O método enviar() deve ser implementado pelo produto concreto.');
  }
}

module.exports = Notificacao;
