const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const mainController = require("../controllers/mainController"); 
const autenticacao = require("../config/autenticacao");
const upload = require("../config/upload");

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

module.exports = router;