const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Cartao_cliente = sequelizeconnect.define(
  "Cartao_cliente",
  {
    data_criacao: {
      type: DataTypes.DATEONLY,
    },
    data_uso_premio: {
        type: DataTypes.DATEONLY,
      },
    qtd_refeicao: {
        type: DataTypes.INTEGER
    },
    UsuarioId:{
      type: DataTypes.INTEGER,
    },
    PromocaoId:{
      type: DataTypes.INTEGER,
    }
  },
  {
    timestamps: false,
    tableName: "cartao_cliente",
  }
);

module.exports = Cartao_cliente;