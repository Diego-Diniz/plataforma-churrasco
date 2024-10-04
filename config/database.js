require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const { Sequelize } = require('sequelize');

// Configura o Sequelize com os dados do banco
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

module.exports = sequelize;