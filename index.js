const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const session = require("express-session");
const passport = require("passport");

// Importa TODOS os models e conexão automaticamente
const db = require("./models");

// Models individuais
const { 
  Usuario, 
  Cartao_cliente, 
  Promocao, 
  Restaurante, 
  Unid_Restaurante, 
  Permissao, 
  Grupo, 
  Token 
} = db;

// =============================
// ASSOCIAÇÕES ENTRE MODELS
// =============================

// Token ↔ Usuario
Token.belongsTo(Usuario);
Usuario.hasMany(Token);

// Grupo ↔ Permissão (N:N)
Grupo.belongsToMany(Permissao, { through: "grupos_permissao" });
Permissao.belongsToMany(Grupo, { through: "grupos_permissao" });

// Unid_Restaurante ↔ Promoção (N:N)
Unid_Restaurante.belongsToMany(Promocao, { through: "promo_unidade" });
Promocao.belongsToMany(Unid_Restaurante, { through: "promo_unidade" });

// Cartão do cliente ↔ Usuario
Cartao_cliente.belongsTo(Usuario);
Usuario.hasMany(Cartao_cliente);

// Unidade ↔ Restaurante (1:N)
Unid_Restaurante.belongsTo(Restaurante);
Restaurante.hasMany(Unid_Restaurante);

// Cartão ↔ Promoção
Cartao_cliente.belongsTo(Promocao);
Promocao.hasMany(Cartao_cliente);

// Usuario ↔ Grupo
Usuario.belongsTo(Grupo, { foreignKey: "GrupoId" });
Grupo.hasMany(Usuario, { foreignKey: "GrupoId" });

// =============================
// Middleware Express
// =============================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializa Passport corretamente
app.use(passport.initialize());
app.use(passport.session());

// Rotas
const mainRouter = require("./router/mainRouters");
app.use("/", mainRouter);

// =============================
// TESTE DE CONEXÃO
// =============================
db.sequelize.authenticate()
  .then(() => console.log("🔥 Conectado ao PostgreSQL via config.json!"))
  .catch(err => console.error("❌ Erro ao conectar no banco:", err));

// =============================
// Start server
// =============================
app.listen(port, () => {
  console.log("Servidor funcionando na porta: " + port);
});
