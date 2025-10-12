const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const mainController = require("../controllers/mainController"); 
const autenticacao = require("../config/autenticacao");
const funcionarioController = require("../controllers/funcionarioController")

// Páginas login
router.get('/login', loginController.abrelogin);

router.get('/cadastro', loginController.cadastrar);

//router.get('/forgot', loginController.forgot);


router.post('/cadastro', loginController.cadastro);

router.post('/login', loginController.logar);

router.post('/forgot', loginController.recuperar);

router.post('/token' , loginController.atualizarsenha);


// Rota para abrir a tela de cadastro de funcionário
router.get("/admin/Cadastrarfuncionarios", (req, res) => {
  res.render("admin/cadastrarFuncionario"); 
}); 
// Rota para cadastrar funcionário 
router.post("/funcionarios", funcionarioController.cadastrarFuncionario);
//rota listar funcionarios
router.get("/admin/listarFuncionarios", funcionarioController.listarFuncionarios);


//filtro para buscar pelo nome ou id
router.get("/admin/funcionarios/buscar", funcionarioController.buscarFuncionario);
router.get("/admin/cadastroSucesso", (req, res) => {
  res.render("admin/cadastroSucesso");
});


module.exports = router;