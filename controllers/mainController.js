const bcrypt = require("bcrypt");
const Funcionario = require("../models/funcionario");
const Usuario = require("../models/Usuario");
const upload = require("../config/upload"); // caminho para o arquivo upload
const { Op } = require("sequelize");


function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}
async function cadastrarFuncionario(req, res) {
  const { nome, email, funcao, cpf, data_nasc, telefone, senha, admin } = req.body;

  if (!nome || !email || !senha || !funcao || !cpf || !data_nasc || !telefone) {
    return res.render("admin/cadastrarFuncionario", {
      msg: "Preencha todos os campos obrigatórios!"
    });
  }

    if (!validarCPF(cpf)) {
    return res.render("admin/cadastrarFuncionario", { msg: "CPF inválido! Verifique os números digitados." });
    msgType: "error"
  }

  try {

     var cpfExiste = await Funcionario.findOne({where: {cpf}});
    if(cpfExiste){
      return res.render("admin/cadastrarFuncionario", {msg: "Este CPF já está cadastrado!"});
      msgType: "warning"
    }
    const hash = await bcrypt.hash(senha, 10);

    await Funcionario.create({
      nome,
      email,
      funcao,
      cpf,
      data_nasc,
      telefone,
      senha: hash,
      admin: admin === "on"
    });

    res.render("admin/cadastrarFuncionario", {
      msg: "Funcionário cadastrado com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);
    res.status(500).send("Erro ao cadastrar funcionário.");
  }
}

//listar funcionarios
async function listarFuncionarios(req, res) {
  try{
    const funcionarios = await Funcionario.findAll();
    res.render("admin/listarFuncionarios", {funcionarios});
  }catch(error){
    console.error("Erro ao listar funcionarios:", error);
    res.status(500).send("Erro ao carregar lista de funcionários.")
  }
  
}

async function abreCadastrarFuncionario(req, res) {
    res.render("admin/cadastrarFuncionario");
}

async function buscarFuncionario(req, res) {
  const{nome, id} = req.query;
  
  let where = {};

  if(nome){
    where.nome = { [Op.iLike]: `%${nome}%`};
  }

  if(id){
    where.id = id;
  }

  try{
    var funcionarios = Object.keys(where).length>0 
    ? await Funcionario.findAll({where})
    : await Funcionario.findAll();

    res.render("admin/listarFuncionarios", {funcionarios, nome, id});
  }catch(error){
    console.error("Erro ao buscar funcionario: ", error);
    res.status(500).send("Erro ao buscar funcionário.");
  }
}





// FUNÇÃO: EXIBE PERFIL DO USUÁRIO

async function MeuPerfil(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("Usuário não autenticado.");
    }

    //  o método é findByPk (
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    // Renderiza o EJS com os dados do usuário
    res.render("login/meuPerfil.ejs", { user: usuario });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.status(500).send("Erro ao carregar o perfil do usuário.");
  }
}


// FUNÇÃO: ATUALIZA PERFIL

async function atualizarPerfil(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("Usuário não autenticado.");
    }

    const { nome, cpf, telefone, endereco } = req.body;

    const dadosAtualizacao = { nome, cpf, telefone, endereco };

    // Se uma nova foto foi enviada, atualiza o campo
    if (req.file) {
      dadosAtualizacao.foto = req.file.filename;
    }

    // Atualiza os dados no banco
    await Usuario.update(dadosAtualizacao, {
      where: { id: req.user.id }
    });

    // Redireciona de volta ao perfil
    res.redirect("/meuPerfil");
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).send("Erro ao atualizar o perfil do usuário.");
  }
}

async function cadastrarRefeicao(req, res) {
  res.render("admin/cadastrarRefeicao"); // ou qualquer lógica que você quiser
}

async function refeicoes(req, res) {
  res.send("Refeição cadastrada!");
}

async function minhasRefeicoes(req, res) {
  res.render("usuario/minhasRefeicoes"); // ou qualquer lógica que você quiser
}


// FUNÇÃO: PERFIL ADMINISTRATIVO

async function AdmPerfil(req, res) {
  res.send("Página administrativa do perfil");
}


module.exports = {
  MeuPerfil,
  atualizarPerfil,
  AdmPerfil,
  cadastrarFuncionario,
  listarFuncionarios,
  abreCadastrarFuncionario,
  cadastrarRefeicao,
  refeicoes,
  minhasRefeicoes,
  buscarFuncionario
};
