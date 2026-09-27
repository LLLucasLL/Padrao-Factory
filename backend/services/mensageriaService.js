const { obterFactory } = require('../factories/factoryRegistry');

function criarMensagemBoasVindas(usuario) {
  return {
    assunto: 'Bem-vindo ao sistema de mensageria',
    texto: `Olá, ${usuario.nome}! Seja bem-vindo ao sistema de mensageria.`
  };
}

function obterDestinatario(canal, usuario) {
  switch (String(canal).toUpperCase()) {
    case 'EMAIL':
      return usuario.email;
    case 'SMS':
    case 'WHATSAPP':
      return usuario.celular;
    case 'PUSH':
      return String(usuario.id);
    case 'TELEGRAM':
      return String(usuario.id);
    default:
      throw new Error(`Canal não suportado: ${canal}`);
  }
}

async function enviarPorCanal(canal, usuario, mensagem = criarMensagemBoasVindas(usuario)) {
  const factory = obterFactory(canal);
  const destinatario = obterDestinatario(canal, usuario);
  return factory.enviarMensagem(destinatario, mensagem);
}

async function enviarCanais(canais, usuario, mensagem = criarMensagemBoasVindas(usuario)) {
  const lista = [...new Set((canais || []).map((canal) => String(canal).toUpperCase()))];

  return Promise.allSettled(
    lista.map((canal) => enviarPorCanal(canal, usuario, mensagem))
  ).then((resultados) => resultados.map((resultado, index) => {
    const canal = lista[index].toLowerCase();

    if (resultado.status === 'fulfilled') {
      return resultado.value;
    }

    return {
      sucesso: false,
      canal,
      erro: resultado.reason?.message || 'Erro desconhecido ao enviar a notificação.'
    };
  }));
}

async function enviarBoasVindas(usuario) {
  return enviarCanais(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'], usuario);
}

module.exports = {
  criarMensagemBoasVindas,
  obterDestinatario,
  enviarPorCanal,
  enviarCanais,
  enviarBoasVindas
};
