const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const mainController = require("../controllers/mainController"); 
const autenticacao = require("../config/autenticacao");

// Páginas login
router.get('/login', loginController.abrelogin);

router.get('/cadastro', loginController.cadastrar);

//router.get('/forgot', loginController.forgot);


router.post('/cadastro', loginController.cadastro);

router.post('/login', loginController.logar);

router.post('/forgot', loginController.recuperar);

router.post('/token' , loginController.atualizarsenha);


module.exports = router;