const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const mainController = require("../controllers/mainController"); 
const autenticacao = require("../config/autenticacao");
const upload = require("../config/upload");
const restauranteController = require("../controllers/mainController");


router.get('/login/telaRestaurante', mainController.abreCadastrarRestaurante);
router.post("/restaurantes", mainController.cadastrarRestaurante);
router.get("/login/listarRestaurantes", mainController.listarRestaurantes);
router.post("/restaurantes/:id/editar", mainController.editarRestaurante);
router.post("/restaurantes/:id/excluir", mainController.excluirRestaurante);



// Páginas login
router.get('/login', loginController.abrelogin);

router.get('/cadastro', loginController.cadastrar);

//router.get('/forgot', loginController.forgot);


router.post('/cadastro', loginController.cadastro);

router.post('/login', loginController.logar);

router.post('/forgot', loginController.recuperar);

router.post('/token' , loginController.atualizarsenha);


// Rota para abrir a tela de cadastro de funcionário
router.get("/admin/Cadastrarfuncionarios", mainController.abreCadastrarFuncionario); 

// Rota para cadastrar funcionário 
router.post("/funcionarios", mainController.cadastrarFuncionario);

//rota listar funcionarios
router.get("/admin/listarFuncionarios", mainController.listarFuncionarios);

// Rotas de perfil
router.get('/meuPerfil', mainController.MeuPerfil);
router.post('/atualizarPerfil', upload.single('foto'), mainController.atualizarPerfil);

// Rota administrativa
router.get('/admmeuperfil',  mainController.AdmPerfil); // se quiser reaproveitar

//Rota cadastro refeição adm
router.get('/admincadastrarRefeicao', mainController.cadastrarRefeicao);
router.post('/refeicoes', mainController.refeicoes);

//rota exibir minhas refeições
router.get('/minhasRefeicoes', mainController.minhasRefeicoes);
router.get("/admin/funcionarios/buscar", mainController.buscarFuncionario);

module.exports = router;