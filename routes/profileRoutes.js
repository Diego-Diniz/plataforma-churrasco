const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Rota que requer autenticação
router.get('/profile', authMiddleware, (req, res) => {
    // Suponha que já temos acesso ao id do usuário através do middleware
    res.json({ message: "Acesso concedido ao perfil do usuário.", userId: req.user.id });
});

module.exports = router;