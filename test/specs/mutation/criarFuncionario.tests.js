const request = require('supertest');
const { expect } = require('chai');
const { login } = require('../../helpers/login');

describe('Mutation - Criar Funcionario', () => {
    let tokenResponse;

    beforeEach(async () => {
        tokenResponse = await login({ email: "admin@admin.com", senha: "123456" });
        expect(tokenResponse.status).to.equal(200);
    })

    it('Deve criar um novo funcionario com sucesso', async () => {
        const funcionarioInput = {
            cpf: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
            nome: `Funcionario Teste ${Date.now()}`,
            salario_base: 3000.50,
            admissao: "2023-01-15",
            desligamento: null
        };

        const response = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${tokenResponse.body.data.login.token}`)
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

        expect(response.status).to.equal(200);
        expect(response.body.data.criarFuncionario).to.be.an('object');
        expect(response.body.data.criarFuncionario.id).to.not.be.empty;
        expect(response.body.data.criarFuncionario.cpf).to.equal(funcionarioInput.cpf);
        expect(response.body.data.criarFuncionario.nome).to.equal(funcionarioInput.nome);
        expect(response.body.data.criarFuncionario.salario_base).to.equal(funcionarioInput.salario_base);
        expect(response.body.data.criarFuncionario.admissao).to.equal(funcionarioInput.admissao);
        expect(response.body.data.criarFuncionario.desligamento).to.equal(funcionarioInput.desligamento);
    })

    it('Não deve criar um funcionario sem um token valido', async () => {
        const funcionarioInput = {
            cpf: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
            nome: `Funcionario Teste ${Date.now()}`,
            salario_base: 3000.50,
            admissao: "2023-01-15",
            desligamento: null
        };

        const response = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer invalid-token`)
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

        expect(response.status).to.equal(200);
        expect(response.body.errors[0].message).to.equal('Autenticação obrigatória.')
        expect(response.body.errors[0].extensions.code).to.equal('UNAUTHENTICATED')
    })

    it('Não deve criar um funcionario replicado', async () => {
        const funcionarioInput = {
            cpf: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
            nome: `Funcionario Teste ${Date.now()}`,
            salario_base: 3000.50,
            admissao: "2023-01-15",
            desligamento: null
        };

        const usuario1 = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${tokenResponse.body.data.login.token}`)
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
            }).expect(200);

        const response = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${tokenResponse.body.data.login.token}`)
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

        expect(response.status).to.equal(200);
        expect(response.body.errors[0].message).to.equal('Já existe funcionário com este CPF.')
        expect(response.body.errors[0].extensions.code).to.equal('BAD_USER_INPUT')
    })
})
