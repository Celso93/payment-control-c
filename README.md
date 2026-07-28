# Payment Control API

API GraphQL em Node.js/Express para cadastro de usuários, funcionários e processamento de folha em memória.

## Execução

```bash
npm install
copy .env.example .env
npm start
```

Acesse `http://localhost:4000/graphql`.

## Fluxo inicial

1. Faça `login` com `admin@admin.com` e senha `123456`, e copie o token retornado.
2. Envie `Authorization: Bearer <token>` para as operações protegidas.

O banco já é iniciado com o usuário `ADMIN` ativo. A mutation `criarUsuario` é pública; `atualizarUsuario` exige autenticação e somente aceita a edição do próprio usuário.

```graphql
mutation {
  login(email: "admin@admin.com", senha: "123456") {
    token
    usuario { id nome }
  }
}
```

## Exemplo de processamento

```graphql
mutation {
  processarFolha(competencia: "07/2026") {
    id
    competencia
    data_processamento
  }
}
```

Os valores ficam no array `historicosFuncionarios` de `src/database.js`: salário (tipo 1), INSS (2) e IRRF (3).
