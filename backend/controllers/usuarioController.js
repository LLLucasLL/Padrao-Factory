const pool = require('../config/database');

async function perfil(req, res) {
  try {
    const [usuarios] = await pool.execute(
      `SELECT id, nome, email, celular, criado_em
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [req.usuarioId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res.json({ usuario: usuarios[0] });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
  }
}

module.exports = { perfil };
