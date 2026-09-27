const EmailFactory = require('../backend/factories/EmailFactory');
const SmsFactory = require('../backend/factories/SmsFactory');
const WhatsAppFactory = require('../backend/factories/WhatsAppFactory');
const PushFactory = require('../backend/factories/PushFactory');
const TelegramFactory = require('../backend/factories/TelegramFactory');
const NotificacaoFactory = require('../backend/factories/NotificacaoFactory');
const Notificacao = require('../backend/products/Notificacao');

class ProdutoTeste extends Notificacao {
  async enviar() { return { sucesso: true }; }
}

class FabricaTeste extends NotificacaoFactory {
  criarNotificacao() { return new ProdutoTeste(); }
}

describe('Factory Method', () => {
  test.each([
    [EmailFactory, 'email'],
    [SmsFactory, 'sms'],
    [WhatsAppFactory, 'whatsapp'],
    [PushFactory, 'push'],
    [TelegramFactory, 'telegram']
  ])('cria o produto concreto correto: %s', (FactoryClass, canal) => {
    const factory = new FactoryClass();
    const produto = factory.criarNotificacao();
    expect(produto.constructor.name.toLowerCase()).toContain(canal.toLowerCase());
    expect(produto).toBeInstanceOf(Notificacao);
  });

  test('a fábrica abstrata não cria diretamente um produto', () => {
    const factory = new NotificacaoFactory();
    expect(() => factory.criarNotificacao()).toThrow();
  });

  test('a fábrica usa polimorfismo para enviar', async () => {
    const resultado = await new FabricaTeste().enviarMensagem('id', { texto: 'Olá' });
    expect(resultado.sucesso).toBe(true);
  });
});
