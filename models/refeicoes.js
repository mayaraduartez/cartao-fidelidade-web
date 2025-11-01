const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Refeicao = sequelizeconnect.define(
  "Refeicao",
  {
    cpf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    valor_comanda: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "refeicoes",
    underscored: true,
    timestamps: true, // usa created_at e updated_at
  }
);

module.exports = Refeicao;
