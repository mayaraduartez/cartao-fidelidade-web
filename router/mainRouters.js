const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const autenticacao = require("../config/autenticacao");
const upload = require("../config/upload");
const mainController = require("../controllers/mainController");


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


// Listagem de funcionários
router.get("/admin/listarFuncionarios", mainController.listarFuncionarios);
router.get("/admin/funcionarios/buscar", mainController.buscarFuncionario);

// Rotas de perfil
router.get('/meuPerfil', mainController.MeuPerfil);
router.post('/atualizarPerfil', upload.single('foto'), mainController.atualizarPerfil);

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

// ✅ Edição, exclusão e estender
router.get("/login/telaEditarPromocao/:id/editar", mainController.telaEditarPromocao);
router.post("login/atualizarPromocao", upload.single('foto'), mainController.atualizarPromocao);

router.get("/login/listarPromocoes/excluirPromocao/:id", mainController.excluirPromocao);

router.post("/listarPromocoes/:id/buscar", mainController.buscarPromocao);




module.exports = router;
