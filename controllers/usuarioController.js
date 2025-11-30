const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario"); // usa o model certo

module.exports = {

    cadastrarUsuario: async (req, res) => {
        try {
            const { nome, cpf, dataNasc, telefone, email, senha, confSenha } = req.body;

            if (senha !== confSenha) {
                return res.send("⚠ As senhas não coincidem, tente novamente!");
            }

            // verifica se já existe email cadastrado
            const existe = await Usuario.findOne({ where: { email } });
            if (existe) {
                return res.send("⚠ Email já cadastrado!");
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const foto = req.file ? req.file.filename : null;

            await Usuario.create({
                nome,
                cpf,
                data_nascimento: dataNasc,
                telefone,
                email,
                senha: senhaCriptografada,
                foto
            });

            return res.redirect("/login");  // redireciona após cadastro

        } catch (error) {
            console.log(error);
            return res.send("❌ Erro ao cadastrar usuário (Cheque o console)");
        }
    }

};
