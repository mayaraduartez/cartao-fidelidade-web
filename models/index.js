const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.json");

const db = {};

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const fullPath = path.join(__dirname, file);
    const loaded = require(fullPath);

    let model;

    // 🟦 1) MODELO DEFINIDO DIRETO → sequelize.define(...)
    if (loaded && loaded.sequelize) {
      console.log(`(define direto) ${file}`);
      model = loaded; // já é o model pronto
    }

    // 🟩 2) MODELO ANTIGO → module.exports = (sequelize, DataTypes) => {}
    else if (typeof loaded === "function") {
      console.log(`(função antiga) ${file}`);
      model = loaded(sequelize, DataTypes);
    }

    else {
      throw new Error(`Formato inválido no model: ${file}`);
    }

    db[model.name] = model;
  });

// Associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
