const bcrypt = require("bcrypt");
const Funcionario = require("../models/funcionario");
const Usuario = require("../models/Usuario");
const Refeicao = require("../models/refeicoes");
const upload = require("../config/upload"); // caminho para o arquivo upload
const Sequelize = require('sequelize');

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

    res.render("admin/cadastrarFuncionario", {
      msg: "Funcionário cadastrado com sucesso!"
    });
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

// FUNÇÃO: EXIBE PERFIL DO USUÁRIO
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

    // Renderiza o EJS passando os dados do usuário
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



async function cadastrarRefeicao(req, res) {
  res.render("login/principal"); 
}
async function refeicoes(req, res) {
  try {
    // Corrige os nomes conforme o formulário principal.ejs
    const { cpf_email, valor_comanda } = req.body;

    if (!cpf_email || !valor_comanda) {
      return res.status(400).send("Campos obrigatórios não preenchidos!");
    }

    // Detecta se o campo é um e-mail
    const isEmail = cpf_email.includes("@");

    // Salva no banco via Sequelize
    await Refeicao.create({
      cpf: isEmail ? null : cpf_email,
      email: isEmail ? cpf_email : null,
      valor_comanda: valor_comanda,
    });


    
    // Redireciona para a página "minhasRefeicoes (meuCartao)"
    res.redirect(`/minhasRefeicoes?user=${encodeURIComponent(cpf_email)}`);

  } catch (error) {
    console.error("Erro ao salvar refeição:", error);
    res.status(500).send("Erro ao registrar refeição");
  }
}


async function minhasRefeicoes(req, res) {
  try {
    const username = req.query.user;

    // CORREÇÃO: Use o modelo Refeicao do Sequelize
    const refeicoes = await Refeicao.findAll({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ]
      },
      order: [['created_at', 'DESC']]
    });

    res.render("login/meuCartao", { 
      username, 
      refeicoes 
    });
  } catch (error) {
    console.error("Erro ao buscar refeições:", error);
    res.status(500).send("Erro ao carregar suas refeições");
  }
}








module.exports = {
  MeuPerfil,
  atualizarPerfil,
  cadastrarFuncionario,
  listarFuncionarios,
  abreCadastrarFuncionario,
  cadastrarRefeicao,
  refeicoes,
  minhasRefeicoes
};
