const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
var session = require("express-session");
var passport = require("passport"); 

const mainRouter = require("./router/mainRouter");

const Usuario = require("./models/Usuario");
const Cartao_cliente = require("./models/Cartao_cliente");
const Promocao = require("./models/Promocao");
const Restaurante = require("./models/Restaurante");
const Unid_Restaurante = require("./models/Unid_Restaurante");
const Permissao = require("./models/Permissao");
const Grupo = require("./models/Grupo");
const Token = require("./models/Token");

// Define as relações entre os modelos
Token.belongsTo(Usuario);
Usuario.hasMany(Token);

Usuario.belongsTo(Unid_Restaurante);
Unid_Restaurante.hasMany(Usuario);

Usuario.belongsTo(Grupo);
Grupo.hasMany(Usuario);

Grupo.belongsToMany(Permissao, { through: 'grupos_permissao' });
Permissao.belongsToMany(Grupo, { through: 'grupos_permissao' });

Unid_Restaurante.belongsToMany(Promocao, { through: 'promo_unidade' });
Promocao.belongsToMany(Unid_Restaurante, { through: 'promo_unidade' });

Cartao_cliente.belongsTo(Usuario);
Usuario.hasMany(Cartao_cliente);

Unid_Restaurante.belongsTo(Restaurante);
Restaurante.hasMany(Unid_Restaurante);

Cartao_cliente.belongsTo(Promocao);
Promocao.hasMany(Cartao_cliente);


//configuração dos arquivos de visão (VIEWS)
//app.set("view engine", "ejs");

//configurar para receber dados por metodo post
app.use(express.urlencoded({ extended: false }));

//pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

app.use("/", mainRouter);

app.listen(port, function () {
  console.log("Servidor funcionando na porta: " + port);
});