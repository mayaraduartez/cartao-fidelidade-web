const path = require("path");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const Usuario = require("../models/Usuario");
const Restaurante = require("../models/Restaurante");
const Grupo = require("../models/Grupo");

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

async function cadastrarCliente(req, res) {
  const { nome, sobrenome, email, telefone, cpf, data_nascimento, senha } =
    req.body;

  if (
    !nome ||
    !sobrenome ||
    !email ||
    !telefone ||
    !cpf ||
    !data_nascimento ||
    !senha
  ) {
    return res.render("login/cadastrar", {
      msg: "Preencha todos os campos obrigatórios!",
      msgType: "error",
    });
  }

  try {
    const clienteExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ cpf }, { email }],
      },
    });

    if (clienteExistente) {
      return res.render("login/cadastrar", {
        msg: "CPF ou e-mail já cadastrados!",
        msgType: "warning",
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome,
      sobrenome,
      email,
      telefone,
      cpf,
      data_nascimento,
      senha: hash,
    });

    res.render("login/cadastrar", {
      msg: "Cliente cadastrado com sucesso!",
      msgType: "success",
    });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).send("Erro ao cadastrar cliente.");
  }
}

async function listarFuncionarios(req, res) {
  try {
    const funcionarios = await Usuario.findAll({
      include: { model: Grupo },
    });
    res.render("admin/listarFuncionarios", { funcionarios });
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    res.status(500).send("Erro ao listar funcionários");
  }
}

async function abreCadastrarRestaurante(req, res) {
  try {
    const restaurantes = await Restaurante.findAll();
    res.render("login/telaRestaurante", { restaurantes });
  } catch (error) {
    console.error("Erro ao abrir tela de restaurante:", error);
    res.status(500).send("Erro ao carregar a tela de restaurante.");
  }
}

async function buscarFuncionario(req, res) {
  const { nome, id } = req.query;
  let where = {};

  if (nome) where.nome = { [Op.iLike]: `%${nome}%` };
  if (id) where.id = id;

  try {
    const funcionarios =
      Object.keys(where).length > 0
        ? await Usuario.findAll({
            where,
            include: Grupo,
          })
        : await Usuario.findAll({ include: Grupo });

    res.render("admin/listarFuncionarios", { funcionarios, nome, id });
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    res.status(500).send("Erro ao buscar funcionário.");
  }
}

// -----------------------------
// 🍽️ RESTAURANTES
// -----------------------------

async function cadastrarRestaurante(req, res) {
  try {
    const { nome, endereco } = req.body;
    if (!nome || !endereco) {
      return res.status(400).send("Preencha todos os campos!");
    }

    await Restaurante.create({ nome, endereco });
    res.redirect("/login/telaRestaurante");
  } catch (error) {
    console.error("Erro ao cadastrar restaurante:", error);
    res.status(500).send("Erro ao cadastrar restaurante");
  }
}

async function listarRestaurantes(req, res) {
  try {
    const restaurantes = await Restaurante.findAll();
    res.render("login/telaRestaurante", { restaurantes });
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

    res.redirect("/login/telaRestaurante"); // ✅ corrigido
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
    res.redirect("/login/telaRestaurante"); // ✅ corrigido
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

async function listarClientes(req, res) {
  try {
    const clientes = await Usuario.findAll({
      where: {
        [Op.or]: [{ GrupoId: null }, { GrupoId: "" }],
      },
    });
    res.render("admin/listarClientes", { clientes });
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).send("Erro ao carregar lista de clientes.");
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

async function tela_cadastra_funcionario(req, res) {
  try {
    // Consulta todos os grupos no banco de dados
    const grupos = await Grupo.findAll();
    salva_cadastra_funcionario;
    // Renderiza a tela de cadastro de funcionário e passa os grupos para o template
    res.render("admin/cadastrarFuncionario", { grupos });
  } catch (error) {
    console.error("Erro ao buscar grupos:", error);
    res.status(500).send("Erro interno do servidor");
  }
}

async function salva_cadastra_funcionario(req, res) {
  const { nome, cpf, data_nasc, telefone, email, senha, grupo } = req.body;

  // Verificação de campos obrigatórios
  if (!nome || !email || !senha || !cpf || !data_nasc || !telefone || !grupo) {
    const grupos = await Grupo.findAll();
    return res.render("admin/cadastrarFuncionario", {
      msg: "Preencha todos os campos obrigatórios!",
      msgType: "error",
      grupos,
    });
  }

  // Validação de CPF
  if (!validarCPF(cpf)) {
    const grupos = await Grupo.findAll();
    return res.render("admin/cadastrarFuncionario", {
      msg: "CPF inválido! Verifique os números digitados.",
      msgType: "error",
      grupos,
    });
  }

  try {
    // Verifica se já existe funcionário com o mesmo CPF ou email
    const funcionarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ cpf }, { email }],
      },
    });

    if (funcionarioExistente) {
      const grupos = await Grupo.findAll();
      return res.render("admin/cadastrarFuncionario", {
        msg: "Este CPF ou e-mail já está cadastrado!",
        msgType: "warning",
        grupos,
      });
    }

    // Gera o hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // Cria o funcionário (na tabela `usuarios`)
    const usuario = await Usuario.create({
      nome,
      cpf,
      data_nascimento: data_nasc,
      telefone,
      email,
      senha: hash,
    });

    // Busca o grupo selecionado
    const grupoSelecionado = await Grupo.findByPk(grupo); // 'grupo' vem do form

    // Associa o usuário ao grupo
    if (grupoSelecionado) {
      await usuario.addGrupo(grupoSelecionado);
    }
    // Recarrega os grupos e mostra mensagem de sucesso
    const grupos = await Grupo.findAll();
    res.render("admin/cadastrarFuncionario", {
      msg: "Funcionário cadastrado com sucesso!",
      msgType: "success",
      grupos,
    });
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);
    const grupos = await Grupo.findAll();
    res.render("admin/cadastrarFuncionario", {
      msg: "Erro ao cadastrar funcionário. Tente novamente.",
      msgType: "error",
      grupos,
    });
  }
}

// -----------------------------
// 🚀 EXPORTA TUDO
// -----------------------------

module.exports = {
  // funcionários
  listarFuncionarios,
  buscarFuncionario,

  // restaurantes
  //abreCadastrarRestaurante,
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
  minhasRefeicoes,
  listarClientes,
  cadastrarCliente,
  tela_cadastra_funcionario,
  salva_cadastra_funcionario,
};
