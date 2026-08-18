const request = require('supertest');

async function criarFuncionario(tokenResponse, funcionarioInput) {
    return await request('http://localhost:4000')
        .post('/graphql')
        .set('Authorization', `Bearer ${tokenResponse}`)
        .send({
            query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                                criarFuncionario(input: $input) {
                                    id
                                    cpf
                                    nome
                                    salario_base
                                    admissao
                                    desligamento
                                }
                            }`,
            variables: {
                input: funcionarioInput
            }
        })
}

module.exports = {
    criarFuncionario
}