'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("funcionarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      funcao:{
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      cpf:{
        type: Sequelize.STRING(14),
        allowNull:false,
        unique: true,
      },
      data_nasc:{
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      telefone:{
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("funcionarios");
  }
};
