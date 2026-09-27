function obterBaseUrl() {
  const baseUrl = String(process.env.INFOBIP_BASE_URL || '').replace(/\/$/, '');

  if (!baseUrl || !process.env.INFOBIP_API_KEY) {
    throw new Error('INFOBIP_BASE_URL e INFOBIP_API_KEY são obrigatórios.');
  }

  return baseUrl;
}

function normalizarNumero(numero) {
  return String(numero || '').replace(/\D/g, '');
}

async function requisitar(caminho, corpo) {
  const resposta = await fetch(`${obterBaseUrl()}${caminho}`, {
    method: 'POST',
    headers: {
      Authorization: `App ${process.env.INFOBIP_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(corpo)
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const excecao = dados.requestError?.serviceException || dados.requestError?.policyException;
    const validacoes = excecao?.validationErrors
      ? ` ${JSON.stringify(excecao.validationErrors)}`
      : '';
    const detalhe = excecao?.text
      ? `${excecao.text}${validacoes}`
      : dados.message || (Object.keys(dados).length > 0
        ? JSON.stringify(dados)
        : `HTTP ${resposta.status}`);
    throw new Error(`Infobip: ${detalhe}`);
  }

  return dados;
}

async function enviarSms(destinatario, texto) {
  const remetente = process.env.INFOBIP_SMS_SENDER;
  const numero = normalizarNumero(destinatario);

  if (!remetente) {
    throw new Error('INFOBIP_SMS_SENDER é obrigatório para SMS.');
  }
  if (!numero) {
    throw new Error('O número de destino do SMS é inválido ou está vazio.');
  }

  return requisitar('/sms/2/text/advanced', {
    messages: [{
      from: remetente,
      destinations: [{ to: numero }],
      text: texto
    }]
  });
}

async function enviarWhatsApp(destinatario, texto) {
  const remetente = process.env.INFOBIP_WHATSAPP_SENDER;

  if (!remetente) {
    throw new Error('INFOBIP_WHATSAPP_SENDER é obrigatório para WhatsApp.');
  }

  return requisitar('/whatsapp/1/message/text', {
    from: remetente,
    to: normalizarNumero(destinatario),
    content: { text: texto }
  });
}

module.exports = { enviarSms, enviarWhatsApp };