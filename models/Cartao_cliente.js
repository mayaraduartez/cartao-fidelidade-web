module.exports = (sequelize, DataTypes) => {
  const Cartao_cliente = sequelize.define(
    "Cartao_cliente",
    {
      data_criacao: {
        type: DataTypes.DATEONLY,
      },
      data_uso_premio: {
        type: DataTypes.DATEONLY,
      },
      qtd_refeicao: {
        type: DataTypes.INTEGER,
      },
      UsuarioId: {
        type: DataTypes.INTEGER,
      },
      PromocaoId: {
        type: DataTypes.INTEGER,
      }
    },
    {
      timestamps: false,
      tableName: "cartao_cliente",
    }
  );

  return Cartao_cliente;
};
