const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('prestador', 'contratante'),
    allowNull: false
  },
  avaliacao: {
    type: DataTypes.FLOAT,
    defaultValue: null
  }
}, {
  timestamps: true
});

module.exports = User;