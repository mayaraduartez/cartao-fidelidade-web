"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("promocao", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      foto: Sequelize.STRING,
      nome: {type: Sequelize.STRING, allowNull: false}, 
      descricao: { type: Sequelize.STRING},
      qtd_refeicao: { type: Sequelize.INTEGER},
      tipo_desconto: {type: Sequelize.STRING},
      valor: {type: Sequelize.DOUBLE},
      data_inicio: {type: Sequelize.DATEONLY},
      data_fim: { type: Sequelize.DATEONLY}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("promocao");
  },
};