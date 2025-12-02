const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Usuario = sequelizeconnect.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sobrenome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    GrupoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "usuarios",
    timestamps: false
  }
);

module.exports = Usuario;
