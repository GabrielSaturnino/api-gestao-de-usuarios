var User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

var secret = "jbjasbdjaabbjdssgj91823yuber81723tgrb";

class UserController {

    //  lISTA TODOS OS USUARIOS
    async index(req, res) {
        var users = await User.findAll();
        res.status(200).json(users);
    }

    //  CRIA NOVO USUARIO
    async create(req, res) {
        var { name, email, password } = req.body;
        
        if (name != undefined) {
            if (email != undefined) {
                if (password != undefined) {
                    var list = [{
                        name,
                        email,
                        password,
                        role: 0
                    }];
        
                    const result = await User.findEmail(list);
                    if (result == 1) {
                        res.status(406).json({ msg: "E-mail ja cadastrado!" });
                        return;
                    }
                    res.status(200).json({ msg: "Sucesso" });

                } else {
                    res.status(400).json({ msg: "Digite uma senha!" });;
                }
            } else {
                res.status(400).json({ msg: "Digite um Email!" });;
            }
        } else {
            res.status(400).json({ msg: "Digite um nome!" });;
        }
    }

    //  BUSCA USUARIO PELO ID
    async findUser(req, res) {
        if (isNaN(req.params.id)) res.status(404).json({ msg: "ID inválido ou inexistente!" }); 
        else {
            var id = parseInt(req.params.id);
            const user = await User.findById(id);

            if (user) res.status(200).json(user);
            else res.status(404).json({ msg: "Nenhum usuario encontrado!" });
        }
    }

    //  ATUALIZA DADOS DO USUARIO
    async updateUser(req, res) {
        if (isNaN(req.params.id)) res.status(404).json({ msg: "ID inválido ou inexistente!" });
        else {
            var id = parseInt(req.params.id);
            var { name, email, password } = req.body;
            var list = {
                name,
                email,
                password
            }

            const result = await User.updateUser(id, list);

            if(result. bool === false) res.status(406).json({msg: result.msg});
            else if (result.bool === 1) res.status(200).json({msg: result.msg});
            else if (result.bool === 0) res.status(400).json({msg: result.msg});
            else if (result.status === 406) res.status(406).json({msg: result.msg});
        }
    }

    //  DELETA USUARIO 
    async delete(req, res) {
        if (isNaN(req.params.id)) res.status(404).json({ msg: "ID inválido ou inexistente!" });
        else {
            var id = parseInt(req.params.id);
            const result = await User.deleteUser(id);

            if (result.bol == 1) res.status(200).json({msg: result.msg})
            else res.status(406).json({msg: result.msg});
        }
    }

    //  CRIA TOKEN DE REDEFINICAO DE SENHA
    async recoverPassword(req, res) {
        var email = req.body.email;

        if (email != undefined) {
            var result = await PasswordToken.create(email);

            if (result.status) {
                // Envia um e-mail com o token para o usuário recuperar a senha 
                res.status(200).json({token: "" + result.token});

            } else {
                res.status(406).json({msg: result.msg});
            }
        } else {
            res.status(400).json('O email não pode estar vazio.');
        }
    }

    //  ALTERA A SENHA
    async changePassword(req, res) {
        var token = req.body.token;
        var password = req.body.password;
        const result = await PasswordToken.validate(token);

        if (result.status) {
            await User.changePassword(password, result.token.user_id, result.token.token);
            res.status(200).json({msg:"Senha alterada!"});

        } else res.status(406).json({msg: "Token invalido!"});
    }

    //  VALIDA LOGIN E GERA TOKEN
    async login(req, res) {
        var { email, password } = req.body;
        if (email != undefined) {
            if (password != undefined) {
                const user = await User.findByEmail(email);

                if (user != undefined) {

                    var resutl = await bcrypt.compare(password, user.password);

                    if (resutl) {
                        var token = jwt.sign({ email: user.email, role: user.role }, secret);
                        res.status(200).json({ token: token });
                    } else {
                        res.status(401).json({msg: "Credenciais inválidas!"});
                    }

                } else {
                    res.json({ status: false });
                }
            } else {
                res.status(400).json('Digite uma senha');
            }
        } else {
            res.status(400).json('Digite um email');
        }
    }
}

module.exports = new UserController();
