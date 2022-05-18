var knex = require("../database/connection");
var User = require("./User");

class PasswordToken {

    //  CRIA O TOKEN DE REDEFINIÇAO DE SENHA
    async create(email) {
        var user = await User.findUserByEmail(email);
        
        if (user != undefined) {
            try {
                var token = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtoke")

                return { status: true, token: token }

            } catch (err) {
                console.log(err);
                return { status: false, msg: err }
            }

        } else {
            return { status: false, msg: "O email não está cadastrado no sistema!" }
        }
    }

     //  VALIDAR TOKEN
    async validate(token) {
        try {
            const result = await knex.select().where({ token: token }).table("passwordtoke");
            if(result.length > 0) {

                var tk = result[0];
                
                if(tk.used) {
                    return {status: false};
                } else {
                    return {status: true, token: tk};
                }

            }else {
                return {status: false};
            }
        } catch (err) {
            console.log(err);
            return {status: false};
        }

    }

}

module.exports = new PasswordToken();