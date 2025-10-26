const path = require("path");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const Funcionario = require("../models/funcionario");
const Usuario = require("../models/Usuario");
const Restaurante = require("../models/Restaurante");
const upload = require("../config/upload"); // se estiver usando upload

// ------------------------
// 🧩 FUNÇÕES DE VALIDAÇÃO
// ------------------------

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

// -----------------------------
// 👨‍💼 FUNCIONÁRIOS
// -----------------------------

async function cadastrarFuncionario(req, res) {
  const { nome, email, funcao, cpf, data_nasc, telefone, senha, admin } = req.body;

  if (!nome || !email || !senha || !funcao || !cpf || !data_nasc || !telefone) {
    return res.render("admin/cadastrarFuncionario", {
      msg: "Preencha todos os campos obrigatórios!",
      msgType: "error"
    });
  }

  if (!validarCPF(cpf)) {
    return res.render("admin/cadastrarFuncionario", {
      msg: "CPF inválido! Verifique os números digitados.",
      msgType: "error"
    });
  }

  try {
    const cpfExiste = await Funcionario.findOne({ where: { cpf } });
    if (cpfExiste) {
      return res.render("admin/cadastrarFuncionario", {
        msg: "Este CPF já está cadastrado!",
        msgType: "warning"
      });
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
      msg: "Funcionário cadastrado com sucesso!",
      msgType: "success"
    });
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);
    res.status(500).send("Erro ao cadastrar funcionário.");
  }
}

async function listarFuncionarios(req, res) {
  try {
    const funcionarios = await Funcionario.findAll();
    res.render("admin/listarFuncionarios", { funcionarios });
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    res.status(500).send("Erro ao carregar lista de funcionários.");
  }
}

async function abreCadastrarFuncionario(req, res) {
  res.render("admin/cadastrarFuncionario");
}

async function buscarFuncionario(req, res) {
  const { nome, id } = req.query;
  let where = {};
  if (nome) where.nome = { [Op.iLike]: `%${nome}%` };
  if (id) where.id = id;

  try {
    const funcionarios =
      Object.keys(where).length > 0
        ? await Funcionario.findAll({ where })
        : await Funcionario.findAll();

    res.render("admin/listarFuncionarios", { funcionarios, nome, id });
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    res.status(500).send("Erro ao buscar funcionário.");
  }
}

// -----------------------------
// 🍽️ RESTAURANTES
// -----------------------------

async function abreCadastrarRestaurante(req, res) {
  res.render("login/telaRestaurante");
}

async function cadastrarRestaurante(req, res) {
  try {
    const { nome, endereco } = req.body;
    if (!nome || !endereco) {
      return res.status(400).send("Preencha todos os campos!");
    }

    await Restaurante.create({ nome, endereco });
    res.redirect("/login/listarRestaurantes");
  } catch (error) {
    console.error("Erro ao cadastrar restaurante:", error);
    res.status(500).send("Erro ao cadastrar restaurante");
  }
}

async function listarRestaurantes(req, res) {
  try {
    const restaurantes = await Restaurante.findAll();
    res.json(restaurantes); // ou res.render("admin/listarRestaurantes", { restaurantes });
  } catch (error) {
    console.error("Erro ao listar restaurantes:", error);
    res.status(500).send("Erro ao listar restaurantes");
  }
}

async function editarRestaurante(req, res) {
  try {
    const { id } = req.params;
    const { nome, endereco } = req.body;

    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) return res.status(404).send("Restaurante não encontrado");

    restaurante.nome = nome;
    restaurante.endereco = endereco;
    await restaurante.save();

    res.redirect("/login/listarRestaurantes");
  } catch (error) {
    console.error("Erro ao editar restaurante:", error);
    res.status(500).send("Erro ao editar restaurante");
  }
}

async function excluirRestaurante(req, res) {
  try {
    const { id } = req.params;
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) return res.status(404).send("Restaurante não encontrado");

    await restaurante.destroy();
    res.redirect("/login/listarRestaurantes");
  } catch (error) {
    console.error("Erro ao excluir restaurante:", error);
    res.status(500).send("Erro ao excluir restaurante");
  }
}

// -----------------------------
// 👤 PERFIL DE USUÁRIO
// -----------------------------

async function MeuPerfil(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("Usuário não autenticado.");
    }

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    res.render("login/meuPerfil.ejs", { user: usuario });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.status(500).send("Erro ao carregar o perfil do usuário.");
  }
}

async function atualizarPerfil(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("Usuário não autenticado.");
    }

    const { nome, cpf, telefone, endereco } = req.body;
    const dadosAtualizacao = { nome, cpf, telefone, endereco };

    if (req.file) {
      dadosAtualizacao.foto = req.file.filename;
    }

    await Usuario.update(dadosAtualizacao, { where: { id: req.user.id } });
    res.redirect("/meuPerfil");
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).send("Erro ao atualizar o perfil do usuário.");
  }
}

// -----------------------------
// ⚙️ OUTRAS FUNÇÕES
// -----------------------------

async function cadastrarRefeicao(req, res) {
  res.render("admin/cadastrarRefeicao");
}

async function refeicoes(req, res) {
  res.send("Refeição cadastrada!");
}

async function minhasRefeicoes(req, res) {
  res.render("usuario/minhasRefeicoes");
}

async function AdmPerfil(req, res) {
  res.send("Página administrativa do perfil");
}

// -----------------------------
// 🚀 EXPORTA TUDO
// -----------------------------

module.exports = {
  // funcionários
  cadastrarFuncionario,
  listarFuncionarios,
  abreCadastrarFuncionario,
  buscarFuncionario,

  // restaurantes
  abreCadastrarRestaurante,
  cadastrarRestaurante,
  listarRestaurantes,
  editarRestaurante,
  excluirRestaurante,

  // perfis e refeições
  MeuPerfil,
  atualizarPerfil,
  AdmPerfil,
  cadastrarRefeicao,
  refeicoes,
  minhasRefeicoes
};
