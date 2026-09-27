const Notificacao = require('./Notificacao');

/**
 * Canal adicional do desafio do laboratório.
 * Não há integração externa obrigatória no enunciado; por isso o produto
 * mantém a implementação preparada e retorna o estado como simulação.
 */
class TelegramNotificacao extends Notificacao {
  async enviar(destinatario, mensagem) {
    return {
      sucesso: true,
      canal: 'telegram',
      destinatario,
      mensagem: mensagem.texto,
      observacao: 'Canal Telegram preparado como produto do Factory Method.'
    };
  }
}

module.exports = TelegramNotificacao;
