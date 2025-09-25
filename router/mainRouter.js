const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); 
const mainController = require("../controllers/mainController"); 
const autenticacao = require("../config/autenticacao");

// Páginas login
//router.get('/login', loginController.abrelogin);

//router.get('/cadastrar', loginController.cadastrar);

//router.get('/forgot', loginController.forgot);


router.post('/cadastrar', loginController.cadastro);

router.post('/login', loginController.logar);

router.post('/forgot', loginController.recuperar);

router.post('/token' , loginController.atualizarsenha);


module.exports = router;