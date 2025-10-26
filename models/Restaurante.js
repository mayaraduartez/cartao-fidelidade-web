const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Restaurante = sequelizeconnect.define(
  "Restaurante",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "restaurante",
  }
);

module.exports = Restaurante;
