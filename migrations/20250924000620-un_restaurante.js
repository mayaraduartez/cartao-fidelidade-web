"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("un_restaurantes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      endereco: {type: Sequelize.STRING, allowNull: false},
      cnpj: {type: Sequelize.STRING},
      telefone: {type: Sequelize.STRING},
      RestauranteId: {
        type: Sequelize.INTEGER,
          references: {
            model: "restaurantes",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("un_restaurantes");
  },
};