const Sequelize = require("sequelize");
const sequelizeconnect = new Sequelize(
    "db_cartaofidelidade-2",
    "postgres",
    "postgres",
    {
        host: "localhost",
        port: "5433",
        dialect: "postgres",
    }
);

module.exports = sequelizeconnect;