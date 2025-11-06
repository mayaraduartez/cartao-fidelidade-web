"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      foto: Sequelize.STRING,
      nome: {type: Sequelize.STRING, allowNull: false},
      sobrenome: {type: Sequelize.STRING, allowNull: false},
      data_nascimento: Sequelize.DATEONLY,
      cpf: { type: Sequelize.STRING, unique:true },
      email: { type: Sequelize.STRING, allowNull: false, unique:true },
      senha: {type: Sequelize.STRING, allowNull: false},
      telefone: Sequelize.STRING,
      rua: Sequelize.STRING,
      bairro: Sequelize.STRING,
      cidade: Sequelize.STRING,
      nro_endereco: Sequelize.STRING,
      UF: Sequelize.STRING,
      GrupoId: {
        type: Sequelize.INTEGER,
          references: {
            model: "grupos",
            key: "id",
          },
          onUpdate: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("usuarios");
  },
};