"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("permissao", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {type: Sequelize.STRING, allowNull: false},
      slug: {type: Sequelize.STRING, allowNull: false, unique: true},
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("permissao");
  },
};