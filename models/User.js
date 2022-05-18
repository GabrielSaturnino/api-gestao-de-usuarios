var knex = require('../database/connection');
var bcrypt = require('bcrypt');
const res = require('express/lib/response');

class User {

    //  BUSCA TODOS USUARIOS
    async findAll() {
        try {
            var result = await knex.select("id", "name", "email", "role").table("users");
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }


    //  BUCA PELO ID
    async findById(id) {
        try {
            const user = await knex.select("id", "name", "email", "role").where({ id: id }).table("users");
            if (user.length > 0) return user;
            else return undefined;
        } catch (err) {
            console.log(err);
            res.status(406);
        }

    }


    //  BUSCA PELO EMAIL
    async findUserByEmail(email) {
        try {
            const user = await knex.select().where({ email: email }).table("users");
            if (user.length > 0) return user[0];
            else return undefined;
        } catch (err) {
            console.log(err);
            res.status(406);
        }
    }


    //  CADASTRA UM USUARIO
    async new(user) {
        try {
            var hash = await bcrypt.hash(user[0].password, 10);
            user[0].password = hash;
            await knex.insert(user).table("users");

        } catch (err) {
            console.log(err);
        }
    }


    //  BUSCA UM EMAIL
    async findEmail(user) {
        try {
            var result = await knex.select().table("users").where({ email: user[0].email });
            console.log(result.length);
            if (result.length == 0) this.new(user);
            else return 1;

        } catch (err) {
            console.log(err);
            return false;
        }
    }


    //  DELETA USUARIO
    async deleteUser(id) {
        try {
            var foregin = await knex.select().where({ user_id: id }).table("passwordtoke");

            if (foregin.length > 0) {
                await knex.where({ user_id: id }).delete().table("passwordtoke");
                var result = await knex.where({ id: id }).delete().table("users");
                if (result == 1) return { bol: 1, msg: "Usuario deletado!" };
                else return { bol: 0, msg: "Usuário não existe" };
            } else {
                var result = await knex.where({ id: id }).delete().table("users");
                if (result == 1) return { bol: 1, msg: "Usuario deletado!" };
                else return { bol: 0, msg: "Usuário não existe" };
            }

        } catch (err) {
            console.log(err)
        }
    }


    //  ATUALIZA DADOS DO USUARIO
    async updateUser(id, user) {
        try {
            const list = await knex.select().where({ id: id }).table("users");
            if (list.length > 0) {
                if (user.name != undefined && user.name != list[0].name) {
                    var result = await knex.where({ id: id }).update({ name: user.name }).table("users");
                    if (result) return { bool: 1, msg: "Dados alterados!" };
                    else return { bool: 0, msg: "Erro ao alterar o nome!" };
                }

                if (user.email != undefined && user.name != list[0].email) {
                    var result = await knex.select().where({ email: user.email }).table("users");
                    console.log(typeof (result), result);

                    if (result.length > 0) {
                        return { status: 406, msg: "E-mail ja cadastrado" };
                    } else {
                        var result2 = await knex.where({ id: id }).update({ email: user.email }).table("users");
                        if (result2) return { bool: 1, msg: "Dados alterados!!" };
                        else return { bool: 0, msg: "Error" };
                    }
                }

                if (user.role != undefined && user.name != list[0].role) {
                    var result = await knex.where({ id: user.id }).update({ role: user.role }).table("users");
                    if (result) return { bol: 1, msg: "Rol aterado com sucesso!" }
                    else return { bol: 0, msg: "Error" }
                }
            } else {
                return { bool: false, msg: "Usuário não encontrado" }
            }

        } catch (err) {
            console.log(err);
        }
    }


    //  MODIFICA A SENHA
    async changePassword(newPassword, id, token) {
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({ password: hash }).where({ id: id }).table("users");
        
        //  DEFINE O TOKEN COMO USADO
        await knex.update({used: 1}).where({token: token}).table("passwordtoke");
    }
}

module.exports = new User();