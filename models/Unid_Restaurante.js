const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Unid_Restaurante = sequelizeconnect.define(
  "Unid_Restaurante",
  {
    endereco: {
      type: DataTypes.STRING,
    },
    cnpj: {
        type: DataTypes.STRING,
    },
    telefone: {
        type: DataTypes.STRING,
    },
    RestauranteId: {
        type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false,
    tableName: "un_restaurantes",
  }
);

module.exports = Unid_Restaurante;