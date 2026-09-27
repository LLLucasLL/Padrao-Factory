const EmailFactory = require('./EmailFactory');
const SmsFactory = require('./SmsFactory');
const WhatsAppFactory = require('./WhatsAppFactory');
const PushFactory = require('./PushFactory');
const TelegramFactory = require('./TelegramFactory');

const factories = {
  EMAIL: EmailFactory,
  SMS: SmsFactory,
  WHATSAPP: WhatsAppFactory,
  PUSH: PushFactory,
  TELEGRAM: TelegramFactory
};

function obterFactory(canal) {
  const chave = String(canal || '').trim().toUpperCase();
  const FactoryClass = factories[chave];

  if (!FactoryClass) {
    throw new Error(`Canal de notificação inválido: ${canal}`);
  }

  return new FactoryClass();
}

function listarCanais() {
  return Object.keys(factories);
}

module.exports = { obterFactory, listarCanais };
