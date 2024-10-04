const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Registro de usuário
router.post(
  '/register',
  [
    // Validações
    body('nome').notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('Insira um e-mail válido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('tipo').isIn(['prestador', 'contratante']).withMessage('Tipo de usuário inválido')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha, telefone, endereco, tipo } = req.body;

    try {
      // Verifica se o e-mail já está cadastrado
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Cria o novo usuário
      const user = await User.create({
        nome,
        email,
        senha: hashedPassword,
        telefone,
        endereco,
        tipo
      });

      // Retorna sucesso
      res.status(201).json({ message: 'Usuário criado com sucesso!', user });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar usuário', err });
    }
  }
);

// Login de usuário
router.post('/login', [
    body('email').isEmail().withMessage('Insira um e-mail válido'),
    body('senha').notEmpty().withMessage('A senha é obrigatória')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ error: "Senha incorreta." });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login bem-sucedido.", token });
    } catch (err) {
        console.error(err); // Adiciona log de erro para diagnóstico
        res.status(500).json({ error: "Erro no servidor ao tentar login.", details: err.message });
    }
});






module.exports = router;