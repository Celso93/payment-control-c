# API Payment Control: Controle de pagamentos simplificado.

API GraphQL em Node.js/Express para cadastro de usuários, funcionários e processamento de folha em memória.

## Execução

```bash
npm install
npm start
```

Acesse `http://localhost:4000/graphql`.

## Fluxo inicial

1. Faça `login` com `admin@admin.com` e senha `123456`, e copie o token retornado.
2. Envie `Authorization: Bearer <token>` para as operações protegidas.

O banco já é iniciado com o usuário `ADMIN` ativo.
```graphql
mutation {
  login(email: "admin@admin.com", senha: "123456") {
    token
    usuario { id nome }
  }
}
```


Os cadastros são armazenados em memória, nos arrays contidos no arquivo `src/database.js`.
