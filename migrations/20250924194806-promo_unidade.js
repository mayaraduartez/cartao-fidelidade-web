"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("promo_unidade", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      PromoId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "promocoes", key: "id" }, onDelete: "CASCADE" },
      UnidadeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "unidades", key: "id" }, onDelete: "CASCADE" },
      nome: { type: Sequelize.STRING, allowNull: false },
      descricao: { type: Sequelize.STRING, allowNull: true },
      data_inicio: { type: Sequelize.DATE, allowNull: false },
      data_fim: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("promo_unidade");
  },
};