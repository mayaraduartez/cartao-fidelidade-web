const express = require("express");
const router = express.Router();

const loginController = require("../controllers/loginController"); 
const autenticacao = require("../config/autenticacao");
const upload = require("../config/upload");
const mainController = require("../controllers/mainController");

console.log("Tipo de cadastrarCliente:", typeof mainController.cadastrarCliente);



// ✅ Removido rota duplicada e incorreta
// router.get('/login/telaRestaurante', mainController.abreCadastrarRestaurante); ← essa função não existe ou não é necessária

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
router.post("/cadastro", mainController.cadastrarUsuario);


// ✅ Corrigida rota GET que estava chamando função de POST
router.get("/admin/Cadastrarfuncionarios", (req, res) => {
  res.render("admin/cadastrarFuncionario");
});

// Cadastro de funcionário
router.post("/funcionarios", mainController.cadastrarFuncionario);

// Listagem de funcionários
router.get("/admin/listarFuncionarios", mainController.listarFuncionarios);
router.get("/admin/funcionarios/buscar", mainController.buscarFuncionario);

// Rotas de perfil
router.get('/meuPerfil', mainController.MeuPerfil);
router.post('/atualizarPerfil', upload.single('foto'), mainController.atualizarPerfil);

// Rota administrativa
router.get('/admmeuperfil', mainController.AdmPerfil);
router.get("/admin/listarClientes", mainController.listarClientes);


// Refeições
router.get('/admincadastrarRefeicao', mainController.cadastrarRefeicao);
router.post('/refeicoes', mainController.refeicoes);
router.get('/minhasRefeicoes', mainController.minhasRefeicoes);

module.exports = router;
