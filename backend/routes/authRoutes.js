const express = require('express');
const { cadastro, login, entrada, enviarNotificacao } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/cadastro', cadastro);
router.post('/login', login);
router.get('/entrada', authMiddleware, entrada);
router.post('/notificar', authMiddleware, enviarNotificacao);

module.exports = router;
