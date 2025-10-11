const { DataTypes } = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Permissao = sequelizeconnect.define("Permissao", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true }, 
}, {
  timestamps: false,
  tableName: "permissao",
});

module.exports = Permissao;
