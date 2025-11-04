const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Usuario = sequelizeconnect.define(
  "Usuario",
  {
    nome: {
      type: DataTypes.STRING,
    },
    sobrenome: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.STRING,
    },
    cpf: {
        type: DataTypes.STRING,
        unique: true,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
    },
    telefone: {
        type: DataTypes.STRING,
    },
     endereco: {
  type: DataTypes.STRING,
  allowNull: true,
},
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "usuarios",
  }
);

module.exports = Usuario;