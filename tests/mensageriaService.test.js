jest.mock('../backend/config/email', () => ({ sendMail: jest.fn().mockResolvedValue({ messageId: 'email-test' }) }));
jest.mock('../backend/config/infobip', () => ({
  enviarSms: jest.fn().mockResolvedValue({ messages: [{ messageId: 'sms-test' }] })
}));
jest.mock('../backend/config/whatsapp', () => ({
  enviarWhatsApp: jest.fn().mockResolvedValue({ messageId: 'whatsapp-test' })
}));

const { enviarCanais, obterDestinatario } = require('../backend/services/mensageriaService');

describe('Mensageria', () => {
  const usuario = { id: 7, nome: 'Lucas', email: 'lucas@example.com', celular: '+5512999999999' };

  test('busca o destinatário de cada canal no usuário logado', () => {
    expect(obterDestinatario('EMAIL', usuario)).toBe(usuario.email);
    expect(obterDestinatario('SMS', usuario)).toBe(usuario.celular);
    expect(obterDestinatario('WHATSAPP', usuario)).toBe(usuario.celular);
    expect(obterDestinatario('PUSH', usuario)).toBe('7');
  });

  test('um canal com falha não interrompe os demais', async () => {
    const resultados = await enviarCanais(['EMAIL', 'SMS', 'PUSH'], usuario);
    expect(resultados).toHaveLength(3);
    expect(resultados.filter((item) => item.sucesso)).toHaveLength(3);
  });
});
