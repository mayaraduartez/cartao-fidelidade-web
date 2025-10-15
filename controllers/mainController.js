const bcrypt = require("bcrypt");
const Funcionario = require("../models/funcionario");
const Usuario = require("../models/Usuario");
const upload = require("../config/upload"); // caminho para o arquivo upload

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
module.exports = { 
    cadastrarFuncionario, 
    listarFuncionarios,
    abreCadastrarFuncionario
};




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
  minhasRefeicoes
};
