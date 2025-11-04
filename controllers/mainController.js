const path = require("path");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Sequelize = require('sequelize'); //r

const Usuario = require("../models/Usuario");
//const Restaurante = require("../models/Restaurante");
const Refeicao = require("../models/refeicoes");
const Premio = require("../models/Premio");
//const Funcionario = require("../models/Funcionario"); 
const upload = require("../config/upload")
const Grupo = require('../models/Grupo');

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
  const { nome, sobrenome, email, telefone, cpf, data_nascimento, senha } = req.body;

  if (!nome || !sobrenome || !email || !telefone || !cpf || !data_nascimento || !senha) {
    return res.render("login/cadastrar", {
      msg: "Preencha todos os campos obrigatórios!",
      msgType: "error"
    });
  }

  try {
    const clienteExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ cpf }, { email }]
      }
    });

    if (clienteExistente) {
      return res.render("login/cadastrar", {
        msg: "CPF ou e-mail já cadastrados!",
        msgType: "warning"
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
      senha: hash
    });

    res.render("login/cadastrar", {
      msg: "Cliente cadastrado com sucesso!",
      msgType: "success"
    });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).send("Erro ao cadastrar cliente.");
  }
}
/*
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
        ? await Funcionario.findAll({ where })
        : await Funcionario.findAll();

    res.render("admin/listarFuncionarios", { funcionarios, nome, id });
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    res.status(500).send("Erro ao buscar funcionário.");
  }
} */

// -----------------------------
// 🍽️ RESTAURANTES
// -----------------------------
/*
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
*/

// -----------------------------
// 👤 PERFIL DE USUÁRIO
// -----------------------------

async function MeuPerfil(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("Usuário não autenticado.");
    }

    // Busca o usuário no banco
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    // CORREÇÃO: Buscar refeições usando o CPF/EMAIL do usuário LOGADO
    const historicoRefeicoes = await Refeicao.findAll({
      where: {
        [Sequelize.Op.or]: [
          { cpf: usuario.cpf },      
          { email: usuario.email }   
        ]
      },
      order: [['created_at', 'DESC']]
    });

    // Renderiza o EJS passando os dados do usuário e histórico
    res.render("login/meuPerfil.ejs", { 
      user: usuario,
      historicoRefeicoes: historicoRefeicoes 
    });
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

    // Captura os dados do formulário
    const { nome, cpf, telefone, endereco, data_nascimento, cargo } = req.body;

    // Monta o objeto de atualização
    const dadosAtualizacao = {
      nome,
      cpf,
      telefone,
      data_nascimento,
      cargo
    };

    // Regras específicas para cada tipo de usuário:
    // - Cliente pode atualizar endereço
    // - Funcionário não tinha endereço antes, mas agora pode preencher
    if (endereco !== undefined) {
      dadosAtualizacao.endereco = endereco;
    }

    // Se uma nova imagem foi enviada, salva o nome do arquivo
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

async function listarClientes(req, res) {
  try {
    const clientes = await Usuario.findAll({
  where: {
    [Op.or]: [
      { GrupoId: null },       
      { GrupoId: '' }         
    ]
  }
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

// ========================
// 📌 RENDERIZA A TELA INICIAL
// ========================
async function cadastrarRefeicao(req, res) {
  res.render("login/principal");
}

// ========================
// 📌 CADASTRAR UMA REFEIÇÃO
// ========================
async function refeicoes(req, res) {
  try {
    const { cpf_email, valor_comanda } = req.body;

    if (!cpf_email || !valor_comanda) {
      return res.status(400).send("Campos obrigatórios não preenchidos!");
    }

    const isEmail = cpf_email.includes("@");

    // Cria nova refeição
    await Refeicao.create({
      cpf: isEmail ? null : cpf_email,
      email: isEmail ? cpf_email : null,
      valor_comanda,
    });

    // Verifica se deve conceder prêmio
    await checarOuConcederPremio(cpf_email);

    res.redirect(`/minhasRefeicoes?user=${encodeURIComponent(cpf_email)}`);
  } catch (error) {
    console.error("Erro ao salvar refeição:", error);
    res.status(500).send("Erro ao registrar refeição");
  }
}

// ========================
// 📌 LISTAR REFEIÇÕES DO USUÁRIO
// ========================
async function minhasRefeicoes(req, res) {
  try {
    const username = req.query.user;
    if (!username) return res.status(400).send("Usuário não especificado");

    const refeicoes = await Refeicao.findAll({
      where: {
        [Sequelize.Op.or]: [{ cpf: username }, { email: username }],
        ciclo_concluido: false,
      },
      order: [["created_at", "DESC"]],
    });

    const premio = await Premio.findOne({
      where: {
        [Sequelize.Op.or]: [{ cpf: username }, { email: username }],
        utilizado: false,
      },
    });

    res.render("login/meuCartao", {
      username,
      refeicoes,
      totalRefeicoes: refeicoes.length,
      temPremio: !!premio,
      premio,
    });
  } catch (error) {
    console.error("Erro ao buscar refeições:", error);
    res.status(500).send("Erro ao carregar suas refeições");
  }
}

// ========================
// 📌 VER PRÊMIO (TELA)
// ========================
async function verificarPremio(req, res) {
  try {
    const username = req.query.user;
    if (!username) return res.status(400).send("Usuário não especificado");

    const infoPremio = await obterInfoPremio(username);

    res.render("login/telaPremio", {
      username,
      ...infoPremio,
    });
  } catch (error) {
    console.error("Erro ao verificar prêmio:", error);
    res.status(500).send("Erro ao verificar prêmio");
  }
}

// ========================
// 📌 CONCEDER MANUALMENTE UM PRÊMIO
// ========================
async function concederPremio(req, res) {
  try {
    const username = req.body.user;
    if (!username) return res.status(400).send("Usuário não especificado");

    const infoPremio = await checarOuConcederPremio(username, true);

    res.render("login/telaPremio", {
      username,
      ...infoPremio,
    });
  } catch (error) {
    console.error("Erro ao conceder prêmio:", error);
    res.status(500).send("Erro ao conceder prêmio");
  }
}

// ========================
// 📌 UTILIZAR UM PRÊMIO (ZERAR CICLO)
// ========================
async function utilizarPremio(req, res) {
  try {
    const premioId = req.params.id;
    const username = req.query.user;

    const premio = await Premio.findByPk(premioId);
    if (!premio) return res.status(404).send("Prêmio não encontrado");

    // Marca o prêmio como utilizado
    await premio.update({
      utilizado: true,
      data_utilizacao: new Date(),
    });

    // Marca refeições como concluídas
    await Refeicao.update(
      { ciclo_concluido: true },
      {
        where: {
          [Sequelize.Op.or]: [{ cpf: username }, { email: username }],
          ciclo_concluido: false,
        },
      }
    );

    res.redirect(
      `/minhasRefeicoes?user=${encodeURIComponent(username)}&msg=Prêmio utilizado! Ciclo reiniciado.`
    );
  } catch (error) {
    console.error("Erro ao utilizar prêmio:", error);
    res.status(500).send("Erro ao utilizar prêmio");
  }
}

// ========================
// 🔁 FUNÇÕES AUXILIARES
// ========================

// Retorna total de refeições e prêmio atual
async function obterInfoPremio(username) {
  const totalRefeicoes = await Refeicao.count({
    where: {
      [Sequelize.Op.or]: [{ cpf: username }, { email: username }],
      ciclo_concluido: false,
    },
  });

  const premio = await Premio.findOne({
    where: {
      [Sequelize.Op.or]: [{ cpf: username }, { email: username }],
      utilizado: false,
    },
  });

  return {
    totalRefeicoes,
    temPremio: !!premio,
    premio,
  };
}

// Checa se precisa conceder um prêmio automaticamente
async function checarOuConcederPremio(username, manual = false) {
  const { totalRefeicoes, premio } = await obterInfoPremio(username);

  // Se já tem prêmio, só retorna
  if (premio) {
    return {
      totalRefeicoes,
      temPremio: true,
      premio,
      msg: manual ? "Você já tem um prêmio pendente!" : undefined,
    };
  }

  // Concede prêmio se completou 10 refeições
  if (totalRefeicoes >= 10) {
    const isEmail = username.includes("@");
    const novoPremio = await Premio.create({
      cpf: isEmail ? null : username,
      email: isEmail ? username : null,
    });

    console.log(`🎉 Prêmio concedido para ${username}`);
    return {
      totalRefeicoes,
      temPremio: true,
      premio: novoPremio,
      msg: manual ? "Prêmio concedido com sucesso!" : undefined,
    };
  }

  return {
    totalRefeicoes,
    temPremio: false,
    premio: null,
    msg: manual ? "Você ainda não atingiu 10 refeições." : undefined,
  };
}
/*
async function tela_cadastra_funcionario(req, res) {
  try {
    // Consulta todos os grupos no banco de dados
    const grupos = await Grupo.findAll();
salva_cadastra_funcionario
    // Renderiza a tela de cadastro de funcionário e passa os grupos para o template
    res.render('admin/cadastrarFuncionario', { grupos });
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    res.status(500).send('Erro interno do servidor');
  }
}

async function salva_cadastra_funcionario(req,res){

}
*/
// -----------------------------
// 🚀 EXPORTA TUDO
// -----------------------------

module.exports = {
  // funcionários
 /* cadastrarFuncionario,
  listarFuncionarios,
  buscarFuncionario,*/

  // restaurantes
  /*abreCadastrarRestaurante,
  cadastrarRestaurante,
  listarRestaurantes,
  editarRestaurante,
  excluirRestaurante,*/

  // perfis e refeições
  MeuPerfil,
  atualizarPerfil,
  cadastrarRefeicao,
  refeicoes,
  minhasRefeicoes,
  listarClientes,
  cadastrarCliente,
  //tela_cadastra_funcionario,
  //salva_cadastra_funcionario,
  verificarPremio,
  concederPremio,
  utilizarPremio
};
