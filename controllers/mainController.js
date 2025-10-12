const Usuario = require("../models/Usuario");

async function MeuPerfil(req, res) {
  res.render("login/meuPerfil.ejs");
}


async function atualizarPerfil(req, res) {
  var nome = req.body.nome;
  var cpf = req.body.cpf;
  var telefone = req.body.telefone;
  var endereco = req.body.endereco;

  await Usuario.update(
    { 
        nome: nome,
        cpf: cpf,
        telefone: telefone,
        endereco: endereco
     },
    { where: { id: req.user.id } }
  );
  res.redirect("/meuPerfil");
}

async function AdmPerfil(req, res) {
  res.send("Página administrativa do perfil");
}

module.exports = {MeuPerfil, atualizarPerfil, AdmPerfil}


