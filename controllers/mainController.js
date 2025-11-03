const bcrypt = require("bcrypt");
const Funcionario = require("../models/funcionario");
const Usuario = require("../models/Usuario");
const Refeicao = require("../models/refeicoes");
const Premio = require("../models/Premio");
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

    // 🔥 CORREÇÃO: Buscar refeições usando o CPF/EMAIL do usuário LOGADO
    const historicoRefeicoes = await Refeicao.findAll({
      where: {
        [Sequelize.Op.or]: [
          { cpf: usuario.cpf },      // Busca pelo CPF do usuário logado
          { email: usuario.email }   // Busca pelo email do usuário logado
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

    // Verifica e concede prêmio automaticamente
    await verificarEConcederPremioAutomatico(cpf_email);

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

    if (!username) {
      return res.status(400).send("Usuário não especificado");
    }

    // Buscar apenas refeições do CICLO ATUAL (não concluídas)
    const refeicoes = await Refeicao.findAll({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ],
        ciclo_concluido: false // FILTRAR SÓ AS ATIVAS
      },
      order: [['created_at', 'DESC']]
    });

    // Verificar prêmio pendente
    const premioPendente = await Premio.findOne({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ],
        utilizado: false
      }
    });

    res.render("login/meuCartao", { 
      username, 
      refeicoes,
      totalRefeicoes: refeicoes.length, // Isso agora conta só as ativas
      temPremio: !!premioPendente,
      premio: premioPendente
    });
  } catch (error) {
    console.error("Erro ao buscar refeições:", error);
    res.status(500).send("Erro ao carregar suas refeições");
  }
}

// FUNÇÃO: VERIFICAR E CONCEDER PRÊMIO
async function verificarPremio(req, res) {
  try {
    const username = req.query.user;

    if (!username) {
      return res.status(400).send("Usuário não especificado");
    }

    // Contar refeições do usuário (apenas do ciclo atual)
    const totalRefeicoes = await Refeicao.count({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ],
        ciclo_concluido: false
      }
    });

    // Verificar prêmio com tratamento de erro
    let premioPendente = await Premio.findOne({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ],
        utilizado: false
      }
    });
    
    res.render("login/telaPremio", {
      username,
      totalRefeicoes,
      temPremio: !!premioPendente,
      premio: premioPendente
    });

  } catch (error) {
    console.error("Erro ao verificar prêmio:", error);
    res.status(500).send("Erro ao verificar prêmio");
  }
}

// FUNÇÃO: CONCEDER PRÊMIO
async function concederPremio(req, res) {
  try {
    const username = req.body.user;

    if (!username) {
      return res.status(400).send("Usuário não especificado");
    }

    // Verificar se já existe prêmio pendente
    const premioExistente = await Premio.findOne({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ],
        utilizado: false
      }
    });

    if (premioExistente) {
      return res.render("login/telaPremio", {
        username,
        totalRefeicoes: 10,
        temPremio: true,
        premio: premioExistente,
        msg: "Você já tem um prêmio pendente!"
      });
    }

    // Criar novo prêmio
    const isEmail = username.includes("@");
    
    const novoPremio = await Premio.create({
      cpf: isEmail ? null : username,
      email: isEmail ? username : null,
    });

    res.render("login/telaPremio", {
      username,
      totalRefeicoes: 10,
      temPremio: true,
      premio: novoPremio,
      msg: "Prêmio concedido com sucesso!"
    });

  } catch (error) {
    console.error("Erro ao conceder prêmio:", error);
    res.status(500).send("Erro ao conceder prêmio");
  }
}

// FUNÇÃO: MARCAR PRÊMIO COMO UTILIZADO
async function utilizarPremio(req, res) {
  try {
    const premioId = req.params.id;
    const username = req.query.user;

    // Buscar o prêmio para pegar o email/cpf
    const premio = await Premio.findByPk(premioId);
    
    if (!premio) {
      return res.status(404).send("Prêmio não encontrado");
    }

    // 1. Marcar o prêmio como utilizado
    await Premio.update(
      { 
        utilizado: true,
        data_utilizacao: new Date()
      },
      { where: { id: premioId } }
    );

    // 2. Marcar as refeições como "CONCLUÍDAS" (zerar checkboxes)
    await Refeicao.update(
      { 
        ciclo_concluido: true
      },
      {
        where: {
          [Sequelize.Op.or]: [
            { cpf: username },
            { email: username }
          ],
          ciclo_concluido: false // Só atualizar as que ainda estão ativas
        }
      }
    );

    // 3. Redirecionar para minhasRefeicoes (checkboxes zerados)
    res.redirect(`/minhasRefeicoes?user=${encodeURIComponent(username)}&msg=Prêmio utilizado! Ciclo reiniciado.`);

  } catch (error) {
    console.error("Erro ao utilizar prêmio:", error);
    res.status(500).send("Erro ao utilizar prêmio");
  }
}

// FUNÇÃO: VERIFICAR AUTOMATICAMENTE AO REGISTRAR REFEIÇÃO
async function verificarEConcederPremioAutomatico(username) {
  try {
    // Contar refeições do usuário (apenas do ciclo atual)
    const totalRefeicoes = await Refeicao.count({
      where: {
        [Sequelize.Op.or]: [
          { cpf: username },
          { email: username }
        ],
        ciclo_concluido: false
      }
    });

    // Se atingiu 10 refeições e não tem prêmio pendente
    if (totalRefeicoes >= 10) {
      const premioExistente = await Premio.findOne({
        where: {
          [Sequelize.Op.or]: [
            { cpf: username },
            { email: username }
          ],
          utilizado: false
        }
      });

      if (!premioExistente) {
        const isEmail = username.includes("@");
        
        await Premio.create({
          cpf: isEmail ? null : username,
          email: isEmail ? username : null,
        });

        console.log(`Prêmio concedido automaticamente para: ${username}`);
      }
    }
  } catch (error) {
    console.error("Erro na verificação automática de prêmio:", error);
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
  minhasRefeicoes,
  verificarPremio,
  concederPremio,
  utilizarPremio,
  verificarEConcederPremioAutomatico
};
