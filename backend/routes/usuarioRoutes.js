const express = require('express');
const { perfil } = require('../controllers/usuarioController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();
router.get('/perfil', autenticar, perfil);

module.exports = router;
