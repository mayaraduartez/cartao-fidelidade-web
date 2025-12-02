const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Premio = sequelizeconnect.define(
  "Premio",
  {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data_premio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  utilizado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  data_utilizacao: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'premios',
  timestamps: true
});

module.exports = Premio;