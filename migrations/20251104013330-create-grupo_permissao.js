"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("grupo_permissao", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      GrupoId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "grupos", key: "id" }, onDelete: "CASCADE" },
      PermissaoId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "permissao", key: "id" }, onDelete: "CASCADE" },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("grupo_permissao");
  },
};