const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/User');  // Certifique-se de que esta linha está presente

const Service = sequelize.define('Service', {
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precoPorHora: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    disponibilidade: {
        type: DataTypes.STRING, // Você pode querer usar um tipo mais complexo, dependendo das necessidades
        allowNull: false
    },
    prestadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Note que o nome do modelo está no plural conforme Sequelize modela automaticamente
            key: 'id'
        }
    }
});

// No arquivo de definição do modelo ou um arquivo de inicialização de modelos
User.hasMany(Service, { foreignKey: 'prestadorId', as: 'Servicos' });
Service.belongsTo(User, { foreignKey: 'prestadorId', as: 'Prestador' });

module.exports = Service;