const request = require('supertest');

async function login(variables) {
    return await request('http://localhost:4000')
        .post('/graphql')
        .send({
            query: `
                    mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                           token
                        }
                    }`,
            variables: variables
        })
}

async function loginComplete(variables) {
    return await request('http://localhost:4000')
        .post('/graphql')
        .send({
            query: `
                    mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        usuario {
                            id
                            ativo
                            email
                            nome
                        }
                    }
                }`,
            variables: variables
        })
}


module.exports = {
    login,
    loginComplete
}