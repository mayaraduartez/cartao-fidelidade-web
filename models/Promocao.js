const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Promocao = sequelizeconnect.define(
  "Promocao",
  {
    nome: {
      type: DataTypes.STRING,
    },
    descricao: {
        type: DataTypes.STRING,
    },
    qtd_refeicao: {
        type: DataTypes.INTEGER,
    },
    tipo_desconto: {
        type: DataTypes.STRING,
    },
    valor: {
        type: DataTypes.DOUBLE,
    },
    data_inicio: {
        type: DataTypes.DATEONLY,
    },
    data_fim: {
        type: DataTypes.DATEONLY,
    }
  },
  {
    timestamps: false,
    tableName: "promocao",
  }
);

module.exports = Promocao;