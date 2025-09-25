"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cartao_cliente", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      data_criacao: Sequelize.DATEONLY,
      data_uso_premio: Sequelize.DATEONLY,
      qtd_refeicao: Sequelize.DOUBLE,
      UsuarioId: {
        type: Sequelize.INTEGER,
          references: {
            model: "usuarios",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
      },
      PromocaoId: {
        type: Sequelize.INTEGER,
          references: {
            model: "promocao",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cartao_cliente");
  },
};