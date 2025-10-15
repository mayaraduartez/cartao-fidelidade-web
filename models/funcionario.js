const {DataTypes, DATEONLY} = require("sequelize");
const sequelizeconnect = require("../config/connection");

const Funcionario = sequelizeconnect.define("Funcionario", {
  nome: DataTypes.STRING,
  email: { type: DataTypes.STRING},
  senha: DataTypes.STRING,
  funcao: DataTypes.STRING,
  cpf: {type: DataTypes.STRING, unique:true},
  data_nasc: DataTypes.DATEONLY,
  telefone: DataTypes.STRING,
  admin:{type: DataTypes.BOOLEAN, defaultValue:false},
}, {
  timestamps: false,
  tableName: "funcionarios",
});

module.exports = Funcionario;