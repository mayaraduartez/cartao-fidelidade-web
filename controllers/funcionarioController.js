const bcrypt = require("bcrypt");
const Funcionario = require("../models/funcionario");
const {Op} = require("sequelize");



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
    return res.render("admin/cadastrarFuncionario", { msg: "Preencha todos os campos obrigatórios!" });
  }

  if (!validarCPF(cpf)) {
    return res.render("admin/cadastrarFuncionario", { msg: "CPF inválido! Verifique os números digitados." });
    msgType: "error"
  }

  try {
    //verifica se o cpf ja esta cadastrado
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

    res.redirect("/admin/cadastroSucesso");

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
module.exports = { cadastrarFuncionario, listarFuncionarios, buscarFuncionario };
