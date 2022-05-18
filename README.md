# Api de gestao de usuarios

## Sobre o Projeto
Uma API Rest utilizando MySQL (SQL), com sistema de login que utiliza JSON Web Tokens (JWT) e um sistema de cadastro, edição, remoção e recuperação de senha dos usuários.

## Como executar o projeto
### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: Node.js, Mysql. Além disto é bom ter um editor para trabalhar com o código como VSCode.

### Rodando a API
Primeiramente crie um banco de dados no seu Mysql chamado de apiusers e crie as seguintes tabelas:
```
# TABELA DE USUARIOS
CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    role INT
);

# TABELA DE TOKENS
CREATE TABLE passwordToke(
    idtoken INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(200) NOT NULL,
    user_id INT,
    used TINYINT,

    FOREIGN KEY(user_id)
    REFERENCES users(id)
);
```
No arquivo connection.js, você deve adicionar as configurações da sua instância do Mysql.
```
# EXEMPLO
var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'seu-usuario',
      password : 'sua-senha',
      database : 'apiusers'
    }
  });
```
Feito isso execute o comando "npm i" para instalar as Dependências do Node.

## Endpoints
### GET /user
Esse endpoint é responsável por retornar a listagem de todos os usuários cadastrados no banco de dados, apenas para administradores.
#### Parametros.
Nenhum
#### Respostas
##### Ok! 200
Caso essa resposta aconteça você vai receber a listagem de todos os usuários.
Exemplo de resposta:
```
[
    {
        "id": 17,
        "name": "Luis",
        "email": "Luiz@gmail.com",
        "role": 0
    },
    {
        "id": 18,
        "name": "Gabriel",
        "email": "Gabriel@gmail.com",
        "role": 0
    },
    {
        "id": 19,
        "name": "Mario",
        "email": "Mario@gmail.com",
        "role": 1
    }
]
```

##### Falha na autenticação! 401
Caso essa resposta aconteça, significa que aconteceu alguma falha no processo de autenticação da requisição. Motivos: Token inválido, Token expirado. 
Exemplo de resposta: 
```
{
    "msg": "Voce não está autenticado!"
}
```

### GET /user/:id
Esse endpoint é responsável por retornar o usuário que possui o id informado, apenas para administradores.
#### Parametros.
Nenhum
#### Respostas
##### Ok! 200
Caso essa resposta aconteça você vai receber os dados do usuário especifico.
Exemplo de resposta:
```
[
    {
        "id": 19,
        "name": "Mario",
        "email": "Mario@gmail.com",
        "role": 1
    }
]
```

##### Falha na autenticação! 401
Caso essa resposta aconteça, significa que aconteceu alguma falha no processo de autenticação da requisição. Motivos: Token inválido, Token expirado. 
Exemplo de resposta: 
```
{
    "msg": "Voce não está autenticado!"
}
```

### POST /user
Esse endpoint é responsavel por criar um usuário.
#### Parametros.
name: Nome do usuário.

email: E-mail do usuário.

password: Senha do usuário.

role: 0 || 1

Exemplo:
{
    "name": "nome-usuário",
    "email": "email-usuário",
    "password": "senha-usuário",
    "role": 0
} 

#### Respostas
##### Ok! 200
Caso essa resposta aconteça o usuários foi cadastrado no banco de dados.
Exemplo de resposta:
```
{
    "msg": "Sucesso"
}
```

##### Not Acceptable! 406
Caso essa resposta aconteça significa que o email inserido ja está cadastrado no banco de dados.
Exemplo de resposta: 
```
{
    "msg": "E-mail ja cadastrado!"
}
```

### POST /login
Esse endpoint é responsável por fazer o processo de Login.
#### Parametros.
email: E-mail do usuário cadstrado no sistema.

password: Senha do usuário cadastrado no sistema.

Exemplo: 
```
{
    "email": "Mario@gmail.com",
    "password": "senha-mario"
} 
```
#### Respostas
##### Ok! 200
Caso essa resposta aconteça você vai receber o token JWT para conseguir acessar endpoints protegidos da API.
Exemplo de resposta:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvb3RAZ21haWwuY29tIiwicm9sZSI6MCwiaWF0IjoxNjUyOTAzODYzfQ.hGOIJ9RCwZFfkAm2GdfaeyhDlu9M9X6w3cSGvlfap-w"
}
```
Caso o role do usuário seja 0, ele não tera permissão para acessar certos endpoints.
Exemplo de resposta:
```
{
    "msg": "Voce não tem permissão para isso!"
}
```
Mas se o role for 1, ele terá acesso a todos os endpoints.

##### Falha na autenticação! 401
Caso essa resposta aconteça, significa que aconteceu alguma falha no processo de autenticação da requisição. Motivos: senha ou email incorreto. 
Exemplo de resposta: 
```
{
    {msg: "Credenciais inválidas!"}
}
```

### PUT /user/:id
Esse endpoint é responsável por Alterar os dados de um usuário, e ele so pode ser acessado por usuários com o role 1.
#### Parametros.
name: Novo nome.

email: Novo E-mail.

role: 0 || 1

Exemplo: 
```
{
    "name": "root",
    "email": "root@gmail.com",
    "role": 1
 } 
```
#### Respostas
##### Ok! 200
Caso essa resposta aconteça os dados do usuário foram alterados.
Exemplo de resposta:
```
{
    "msg": "Dados alterados!"
}
```
##### Not Acceptable! 406
Caso o id informádo seja inválido ou inexistente.
Exemplo de resposta:
```
{
    "msg": "Usuário não encontrado"
}
```

### DELETE /user/:id
Esse endpoint é responsável deletar um usuário, e ele so pode ser acessado por usuários com o role 1.
#### Parametros.
Nenhum

#### Respostas
##### Ok! 200
Caso essa resposta aconteça o usuário foi apagado.
Exemplo de resposta:
```
{
    "msg": "Usuario deletado!"
}
```
##### Not Acceptable! 406
Caso o id informádo seja inválido ou inexistente.
Exemplo de resposta:
```
{
    "msg": "Usuário não existe"
}
```

### POST /recoverpassword
Esse endpoint é responsável por gerar um token de auteração de senha, o usuário informa o email e um token será geraldo e salvo na tabela usertoke referenciando o usuário dono do email.
#### Parametros 
Email 
exemplo: 
```
{
    "email": "mario@gmail.com"
} 
```

#### Respostas
##### Ok! 200
Caso essa resposta aconteça o token de redefinição de senha será gerado e enviado para o usuário.
Exemplo:
```
{
    "token": "1652907812531"
}
```

##### Not Acceptable! 406
Caso ocorá essa respposta significa que o email informado nãao está cadastrado no banco de dados.
Exemplo: 
```
{
    "msg": "O email não está cadastrado no sistema!"
}
```

### POST /changepassword
Esse endpoint é responsável alterar a senha do usuário com base no token gerado na rota /recoverpassword.
#### Parametros 
Token
Password
exemplo: 
```
{
    "token": "1652908165529",
    "password": "nova-senha"
}
```

#### Respostas
##### Ok! 200
Caso essa resposta aconteça a senha do usuário foi alterada.
Exemplo:
```
{
    "msg": "Senha alterada!"
}
```

##### Not Acceptable! 406
Caso ocorá essa resposta significa que token é inválido.
Exemplo: 
```
{
    "msg": "Token invalido!"
}
```
