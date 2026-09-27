const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { enviarBoasVindas, enviarCanais, criarMensagemBoasVindas } = require('../services/mensageriaService');

function gerarToken(usuarioId) {
  return jwt.sign(
    { usuarioId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

async function cadastro(req, res) {
  const { nome, senha, email, celular } = req.body;

  if (!nome || !senha || !email || !celular) {
    return res.status(400).json({ mensagem: 'Nome, senha, e-mail e celular são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha deve possuir pelo menos 6 caracteres.' });
  }

  try {
    const [existentes] = await pool.execute(
      'SELECT id FROM usuarios WHERE nome = ? OR email = ? OR celular = ? LIMIT 1',
      [nome, email, celular]
    );

    if (existentes.length > 0) {
      return res.status(409).json({ mensagem: 'Nome, e-mail ou celular já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await pool.execute(
      `INSERT INTO usuarios (nome, senha_hash, email, celular)
       VALUES (?, ?, ?, ?)`,
      [nome.trim(), senhaHash, email.trim().toLowerCase(), celular.trim()]
    );

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
}

async function login(req, res) {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ mensagem: 'Nome de usuário e senha são obrigatórios.' });
  }

  try {
    const [usuarios] = await pool.execute(
      `SELECT id, nome, senha_hash, email, celular
       FROM usuarios
       WHERE nome = ?
       LIMIT 1`,
      [nome.trim()]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'Nome de usuário ou senha inválidos.' });
    }

    const usuario = usuarios[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Nome de usuário ou senha inválidos.' });
    }

    const token = gerarToken(usuario.id);

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        celular: usuario.celular
      }
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
  }
}

async function entrada(req, res) {
  try {
    // O ID vem do token. Os dados de contato são buscados novamente no MySQL.
    const [usuarios] = await pool.execute(
      `SELECT id, nome, email, celular
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [req.usuarioId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário da sessão não encontrado.' });
    }

    const usuario = usuarios[0];
    const mensagem = criarMensagemBoasVindas(usuario);
    const notificacoes = await enviarBoasVindas(usuario);

    return res.json({
      mensagem: mensagem.texto,
      usuario,
      notificacoes
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao carregar a recepção.' });
  }
}

async function enviarNotificacao(req, res) {
  const { canais, texto, assunto } = req.body;

  if (!Array.isArray(canais) || canais.length === 0) {
    return res.status(400).json({ mensagem: 'Informe pelo menos um canal de notificação.' });
  }

  try {
    const [usuarios] = await pool.execute(
      `SELECT id, nome, email, celular
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [req.usuarioId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const usuario = usuarios[0];
    const mensagem = {
      assunto: assunto || 'Nova notificação',
      texto: texto || `Olá, ${usuario.nome}! Você recebeu uma nova notificação.`
    };

    const notificacoes = await enviarCanais(canais, usuario, mensagem);

    return res.json({ mensagem: 'Processamento concluído.', notificacoes });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao processar as notificações.' });
  }
}

module.exports = { cadastro, login, entrada, enviarNotificacao };
