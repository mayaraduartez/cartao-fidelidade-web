const path = require("path");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Sequelize = require('sequelize'); //r

const Usuario = require("../models/Usuario");
//const Restaurante = require("../models/Restaurante");
const Refeicao = require("../models/refeicoes");
const Premio = require("../models/Premio");
const Promocao = require("../models/Promocao");
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


async function listarFuncionarios(req, res) {
  try {
    const funcionarios = await Usuario.findAll({
      include: [{ model: Grupo }]
    });
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
        ? await Usuario.findAll({ where })
        : await Usuario.findAll();

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

    // Busca o usuário no banco
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    // CORREÇÃO: Adicionar tratamento de erro específico para as refeições
    let historicoRefeicoes = [];
    try {
      historicoRefeicoes = await Refeicao.findAll({
        where: {
          [Sequelize.Op.or]: [
            { cpf: usuario.cpf },      
            { email: usuario.email }   
          ]
        },
        order: [['created_at', 'DESC']]
      });
    } catch (refeicaoError) {
      console.log("Aviso: Não foi possível carregar o histórico de refeições:", refeicaoError.message);
      // Continua com array vazio - NÃO quebra o fluxo
      historicoRefeicoes = [];
    }

    // Renderiza o EJS passando os dados do usuário e histórico (mesmo que vazio)
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
    const { 
      nome, 
      sobrenome, 
      cpf, 
      telefone, 
      data_nascimento, 
      rua, 
      bairro, 
      cidade, 
      nro_endereco, 
      UF, 
      cargo 
    } = req.body;

     // **CORREÇÃO: Garantir que nro_endereco seja string**
    const numeroEndereco = Array.isArray(nro_endereco) ? nro_endereco[0] : nro_endereco;

    // Monta o objeto de atualização com TODAS as colunas
    const dadosAtualizacao = {
      nome,
      sobrenome, // ← NOVA COLUNA
      cpf,
      telefone,
      data_nascimento,
      rua,
      bairro,    // ← NOVA COLUNA
      cidade,
      nro_endereco: numeroEndereco,
      UF,
      cargo
    };

    

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

// FUNÇÃO: MOSTRAR TELA DE RECUPERAR SENHA
async function recuperarSenhaForm(req, res) {
  try {
    res.render("login/recuperarSenha.ejs", {
      titulo: "Recuperar Senha",
      mensagem: "Digite seu e-mail para recuperar sua senha."
    });
  } catch (error) {
    console.error("Erro ao abrir tela de recuperar senha:", error);
    res.status(500).send("Erro ao carregar a tela de recuperação de senha.");
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

// ========================
// 📌 cadastrar promoção
// ========================
async function FormPromocao(req, res) {
  try {
    res.render("login/promocao"); 
  } catch (error) {
    console.error("Erro ao carregar o formulário de promoção:", error);
    res.status(500).send("Erro ao carregar a página");
  }
}

async function cadastrarPromocao(req, res) {
  try {
    const {
      nome, 
      descricao,
      qtd_refeicao,
      tipo_desconto,
      valor,
      data_inicio,
      data_fim
    } = req.body;

    // CORREÇÃO: Verificação completa dos campos
    if (!nome || !descricao || !tipo_desconto) {
      return res.status(400).send("Preencha todos os campos obrigatórios!");
    }

    // Se uma nova imagem foi enviada, salva o nome do arquivo
    const foto = req.file ? req.file.filename : null;

    console.log('Arquivo recebido:', req.file);
    console.log('Nome da imagem:', foto);

    await Promocao.create({
      nome,
      descricao,
      qtd_refeicao: qtd_refeicao || 0,
      tipo_desconto,
      valor: valor || 0,
      data_inicio: data_inicio || new Date(),
      data_fim: data_fim || null,
      foto
    });

    res.redirect("/listarPromocoes"); 

  } catch (error) {
    console.error("Erro ao cadastrar promoção:", error);
    res.status(500).send("Erro ao cadastrar promoção: " + error.message);
  }
}

// LISTAR PROMOÇÕES
// ========================
async function listarPromocoes(req, res) {
  try {
    const promocoes = await Promocao.findAll({
      order: [['id', 'DESC']]
    });

    res.render("login/listarPromocoes", { 
      promocoes: promocoes 
    });
  } catch (error) {
    console.error("Erro ao listar promoções:", error);
    res.status(500).send("Erro ao carregar lista de promoções");
  }
}

// BUSCAR PROMOÇÕES
// ========================
async function buscarPromocao(req, res) {
  try {
    const { id, nome } = req.query;

    let whereClause = {};

    if (nome && nome.trim() !== "") {
      whereClause.nome = { [Sequelize.Op.like]: `%${nome}%` };
    }

    if (id && id.trim() !== "") {
      whereClause.id = id; // busca exata por ID
    }

    const promocoes = await Promocao.findAll({
      where: whereClause,
      order: [['id', 'DESC']]
    });

    res.render("login/listarPromocoes", { 
      promocoes,
      filtros: { id, nome }  // retorna filtros para repopular inputs
    });

  } catch (error) {
    console.error("Erro ao buscar promoções:", error);
    res.status(500).send("Erro ao buscar promoções");
  }
}

// EDITAR PROMOÇÃO
// ========================
async function telaEditarPromocao(req, res) {
  try {
    const { id } = req.params;   // pega o id da rota

    if (!id || isNaN(id)) {
      return res.status(400).send("ID inválido");
    }

    // busca a promoção pelo ID
    const promocao = await Promocao.findOne({
      where: { id: id }
    });

    if (!promocao) {
      return res.status(404).send("Promoção não encontrada");
    }

    // renderiza a view de edição
    res.render("login/telaEditarPromocao", { promocao });

  } catch (error) {
    console.error("Erro ao carregar promoção:", error);
    res.status(500).send("Erro ao carregar promoção");
  }
}




// atualizar promoção
async function atualizarPromocao(req, res) {
  try {
    const { id } = req.body;

    const {
      nome,
      descricao,
      qtd_refeicao,
      tipo_desconto,
      valor,
      data_inicio,
      data_fim,
    } = req.body;

    // Se tiver upload de foto
    const foto = req.file ? req.file.filename : null;

    if (!id) {
      return res.status(400).send("ID da promoção ausente para atualização.");
    }

    // Verifica se existe
    const promocao = await Promocao.findByPk(id);
    if (!promocao) {
      return res.status(404).send("Promoção não encontrada.");
    }

    // Atualiza os campos
    promocao.nome = nome;
    promocao.descricao = descricao;
    promocao.qtd_refeicao = qtd_refeicao;
    promocao.tipo_desconto = tipo_desconto;
    promocao.valor = valor;
    promocao.data_inicio = data_inicio;
    promocao.data_fim = data_fim;

    if (foto) {
      promocao.foto = foto;
    }

    // Salva no banco
    await promocao.save();

    res.redirect("/listarPromocoes");
  } catch (error) {
    console.error("Erro ao atualizar promoção:", error);
    res.status(500).send("Erro ao atualizar promoção: " + error.message);
  }
}




//excluir

async function excluirPromocao(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send("ID inválido");
    }

    const promocao = await Promocao.findByPk(id);
    if (!promocao) {
      return res.status(404).send("Promoção não encontrada");
    }

    // Remove imagem se existir
    if (promocao.foto) {
      const fotoPath = path.join(__dirname, "../public/uploads", promocao.foto);
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    }

    // Remove do banco
    await promocao.destroy();

    // Redireciona para lista de promoções
    res.redirect("/listarPromocoes");

  } catch (error) {
    console.error("Erro ao excluir promoção:", error);
    res.status(500).send("Erro ao excluir promoção: " + error.message);
  }
}


      

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

async function salva_cadastra_funcionario(req, res) {
  const { nome, sobrenome, email, cpf, data_nasc, telefone, senha, admin, grupo } = req.body;

  if (!nome || !sobrenome || !email || !senha || !cpf || !data_nasc || !telefone) {
    const grupos = await Grupo.findAll();
    return res.render("admin/cadastrarFuncionario", {
      msg: "Preencha todos os campos obrigatórios!",
      msgType: "error",
      grupos
    });
  }

  if (!validarCPF(cpf)) {
    const grupos = await Grupo.findAll();
    return res.render("admin/cadastrarFuncionario", {
      msg: "CPF inválido! Verifique os números digitados.",
      msgType: "error",
      grupos
    });
  }

  try {
    const cpfExiste = await Usuario.findOne({ where: { cpf } });
    const grupos = await Grupo.findAll();

    if (cpfExiste) {
      return res.render("admin/cadastrarFuncionario", {
        msg: "Este CPF já está cadastrado!",
        msgType: "warning",
        grupos
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome,
      sobrenome,
      email,
      cpf,
      data_nasc,
      telefone,
      senha: hash,
      admin: admin === "on",
      GrupoId: grupo
    });

    res.render("admin/cadastrarFuncionario", {
      msg: "Funcionário cadastrado com sucesso!",
      msgType: "success",
      grupos
    });
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);
    res.status(500).send("Erro interno ao cadastrar funcionário.");
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
  abreCadastrarRestaurante,
  cadastrarRestaurante,
  listarRestaurantes,
  editarRestaurante,
  excluirRestaurante,

  // perfis e refeições
  MeuPerfil,
  atualizarPerfil,
  cadastrarRefeicao,
  refeicoes,
  minhasRefeicoes,
  listarClientes,
  cadastrarCliente,
  tela_cadastra_funcionario,
  salva_cadastra_funcionario,
  verificarPremio,
  concederPremio,
  utilizarPremio,
  recuperarSenhaForm,
  //promoção
  FormPromocao,
  cadastrarPromocao,
  listarPromocoes,
  buscarPromocao,
  atualizarPromocao,
  telaEditarPromocao,
  excluirPromocao
  
};
