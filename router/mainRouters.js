const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const autenticacao = require("../config/autenticacao");
const upload = require("../config/upload");
const mainController = require("../controllers/mainController");

//rota pagina inicial
router.get("/home", mainController.home);
//rota promoção do dia
router.get("/promoDoDia", mainController.telaPromocaoDia);


// ✅ Mantida rota correta para exibir tela com listagem e formulário
router.get("/login/telaRestaurante", mainController.listarRestaurantes);

// ✅ Cadastro de restaurante
router.post("/restaurantes", mainController.cadastrarRestaurante);

// ✅ Edição e exclusão
router.post("/restaurantes/:id/editar", mainController.editarRestaurante);
router.post("/restaurantes/:id/excluir", mainController.excluirRestaurante);

// Páginas login
router.get('/login', loginController.abrelogin);
router.get('/cadastro', loginController.cadastrar);
// router.get('/forgot', loginController.forgot); // opcional
router.post("/cadastrar-cliente", mainController.cadastrarCliente);

router.post('/login', loginController.logar);
router.post('/forgot', loginController.recuperar);
router.post('/token', loginController.atualizarsenha);


router.get("/admin/Cadastrarfuncionarios", mainController.tela_cadastra_funcionario
);

router.post("/admin/Cadastrarfuncionarios", mainController.salva_cadastra_funcionario
);

router.get('/admin/funcionarios/editar/:id', mainController.tela_editar_funcionario);
router.post('/admin/funcionarios/editar/:id', mainController.editarFuncionario);
router.post('/admin/funcionarios/excluir/:id', mainController.excluirFuncionario);

// Listagem de funcionários
router.get("/admin/listarFuncionarios", mainController.listarFuncionarios);
router.get("/admin/funcionarios/buscar", mainController.buscarFuncionario);

// Rotas de perfil
router.get('/meuPerfil', mainController.MeuPerfil);
router.post('/atualizarPerfil', upload.single('foto'), mainController.atualizarPerfil);
//router.get("/recuperarSenha", loginController.recuperarSenhaForm);

// Rota administrativa
router.get("/admin/listarClientes", mainController.listarClientes);


// Cadastro de refeição (admin)
router.get("/admin/refeicoes/novo", mainController.cadastrarRefeicao);
router.post("/refeicoes", mainController.refeicoes);

// Exibir refeições do cliente
router.get("/minhasRefeicoes", mainController.minhasRefeicoes);

// Rotas para prêmios
router.get('/premio', mainController.verificarPremio);
router.post('/conceder-premio', mainController.concederPremio);
router.post('/utilizar-premio/:id', mainController.utilizarPremio);

// Cadastro de promoção (admin)
router.get("/promocao", mainController.FormPromocao);
router.post("/cadastrarPromocao", upload.single('foto'), mainController.cadastrarPromocao);


// Listagem de promoções
router.get("/listarPromocoes", mainController.listarPromocoes);
router.get("/login/promocoes/buscar", mainController.buscarPromocao);

// ✅ Edição, exclusão de promoções
router.get("/login/telaEditarPromocao/:id/editar", mainController.telaEditarPromocao);
// certo ✅
router.post("/atualizarPromocao", upload.single('foto'), mainController.atualizarPromocao);

router.post("/promocoes/excluir/:id", mainController.excluirPromocao);


// Grupos
router.get("/admin/cadastrarGrupo", mainController.tela_cadastra_grupo
);

router.post("/admin/cadastrarGrupo", mainController.salva_cadastra_grupo
);

// Listar todos os grupos
router.get("/admin/listarGrupos", mainController.listarGrupos);

// Buscar grupos por nome
router.get("/admin/grupos/buscar", mainController.buscarGrupo);

// Excluir grupo
router.post("/admin/grupos/excluir/:id", mainController.excluirGrupo);

router.get("/admin/grupos/editar/:id", mainController.telaEditarGrupo);
router.post("/admin/grupos/editar/:id", mainController.editarGrupo);


module.exports = router;
