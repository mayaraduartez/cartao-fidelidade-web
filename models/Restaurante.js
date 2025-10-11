const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Restaurante = sequelizeconnect.define(
  "Restaurante",
  {
    nome: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "restaurante",
  }
);

module.exports = Restaurante;