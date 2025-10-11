const bcrypt = require("bcrypt");
const Funcionario = require("../models/funcionario");
const {Op} = require("sequelize");

async function cadastrarFuncionario(req, res) {
  const { nome, email, funcao, cpf, data_nasc, telefone, senha, admin } = req.body;

  if (!nome || !email || !senha || !funcao || !cpf || !data_nasc || !telefone) {
    return res.render("admin/cadastrarFuncionario", {
      msg: "Preencha todos os campos obrigatórios!"
    });
  }

  try {
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
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.render("admin/cadastrarFuncionario", {
        msg: "Este e-mail já está cadastrado!"
      });
    }

    console.error("Erro ao cadastrar funcionário:", error);
    res.status(500).send("Erro ao cadastrar funcionário.");
  }
}

//listar funcionarios
async function listarFuncionarios(req, res) {
  try{
    const funcionarios = await Funcionario.findAll();0
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
