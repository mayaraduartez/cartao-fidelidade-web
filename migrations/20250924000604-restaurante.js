"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("restaurantes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {type: Sequelize.STRING, allowNull: false}, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("restaurantes");
  },
};