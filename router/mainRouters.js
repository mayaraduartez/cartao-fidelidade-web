const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const mainController = require("../controllers/mainController");
const usuarioController = require("../controllers/usuarioController");
const upload = require("../config/upload"); // multer configurado

// =========================
// RESTAURANTES
// =========================

// Tela com lista + formulário
router.get("/login/telaRestaurante", mainController.listarRestaurantes);

// Cadastro de restaurante (POST) com upload de imagem
router.post("/restaurantes", upload.single('foto'), mainController.cadastrarRestaurante);

// Editar restaurante
router.get("/restaurantes/:id/editar", mainController.formEditarRestaurante);
router.post("/restaurantes/:id/editar", upload.single('foto'), mainController.editarRestaurante);

// Excluir restaurante
router.post("/restaurantes/:id/excluir", mainController.excluirRestaurante);

// =========================
// LOGIN / CLIENTES
// =========================
router.get('/login', loginController.abrelogin);
router.get('/cadastro', loginController.cadastrar);
router.post("/cadastrar-cliente", mainController.cadastrarCliente);

router.post('/login', loginController.logar);
router.post('/forgot', loginController.recuperar);
router.post('/token', loginController.atualizarsenha);

// Usuários
router.post("/cadastrar-usuario", upload.single("foto"), usuarioController.cadastrarUsuario);
router.get("/cadastrar", (req, res) => res.render("login/cadastro_usuario"));
router.get("/cadastrar_restaurante", (req, res) => res.render("login/cadastro_restaurante"));

// =========================
// FUNCIONÁRIOS
// =========================
router.get("/admin/Cadastrarfuncionarios", mainController.tela_cadastra_funcionario);
router.post("/admin/Cadastrarfuncionarios", mainController.salva_cadastra_funcionario);

router.get("/admin/listarFuncionarios", mainController.listarFuncionarios);
router.get("/admin/funcionarios/buscar", mainController.buscarFuncionario);

// =========================
// PERFIL
// =========================
router.get('/meuPerfil', mainController.MeuPerfil);
router.post('/atualizarPerfil', upload.single('foto'), mainController.atualizarPerfil);

// =========================
// CLIENTES
// =========================
router.get("/admin/listarClientes", mainController.listarClientes);

// =========================
// REFEIÇÕES
// =========================
router.get("/admin/refeicoes/novo", mainController.cadastrarRefeicao);
router.post("/refeicoes", mainController.refeicoes);

router.get("/minhasRefeicoes", mainController.minhasRefeicoes);

// =========================
// PRÊMIOS
// =========================
router.get('/premio', mainController.verificarPremio);
router.post('/conceder-premio', mainController.concederPremio);
router.post('/utilizar-premio/:id', mainController.utilizarPremio);

// =========================
// PROMOÇÕES
// =========================
router.get("/promocao", mainController.FormPromocao);
router.post("/cadastrarPromocao", upload.single('foto'), mainController.cadastrarPromocao);

router.get("/listarPromocoes", mainController.listarPromocoes);
router.get("/login/promocoes/buscar", mainController.buscarPromocao);

router.get("/login/telaEditarPromocao/:id/editar", mainController.telaEditarPromocao);
router.post("/login/atualizarPromocao", upload.single('foto'), mainController.atualizarPromocao);

router.get("/login/listarPromocoes/excluirPromocao/:id", mainController.excluirPromocao);
router.post("/listarPromocoes/:id/buscar", mainController.buscarPromocao);

// =========================
// EXPORTAÇÃO
// =========================
module.exports = router;
