const request = require('supertest');
const { expect } = require('chai');

describe('Mutation - Login', () => {
    it('Deve realizar login com sucesso quando informo credenciais validas', async () => {
        const response = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                       token
                    }
                }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "123456"
                }
            })

        expect(response.status).to.equal(200);
        expect(response.body.data.login).to.be.property('token');
        expect(response.body.data.login.token).to.not.be.empty; // valida null e ''
    })

    it('Deve retornar as informacoes do usuario quando informo credenciais validas', async () => {
        const response = await request('http://localhost:4000')
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
                variables: {
                    email: "admin@admin.com",
                    senha: "123456"
                }
            })
        
        expect(response.status).to.equal(200);
        expect(response.body.data.login).to.have.property('token').that.is.a('string').and.not.be.empty;
        expect(response.body.data.login.usuario).to.have.property('id').that.is.a('string');
        expect(response.body.data.login.usuario).to.have.property('nome').that.is.a('string');
        expect(response.body.data.login.usuario).to.have.property('email').that.is.a('string');
        expect(response.body.data.login.usuario).to.have.property('ativo').that.is.a('boolean');
    })

    it('Deve receber um erro quando informar senha invalidas', async () => {
        const response = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                       token
                    }
                }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "1234526"
                }
            })

        expect(response.status).to.equal(200);
        expect(response.body.errors[0].message).to.be.equal('Credenciais inválidas ou usuário inativo.');
    })

    it('Deve receber um erro quando informar email invalido', async () => {
        const response = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                       token
                    }
                }`,
                variables: {
                    email: "adminadmin.com",
                    senha: "1234526"
                }
            })

        expect(response.status).to.equal(200);
        expect(response.body.errors[0].message).to.be.equal('Credenciais inválidas ou usuário inativo.');
        expect(response.body.errors[0].extensions.code).to.be.equal('UNAUTHENTICATED')
    })

    it('Erro no Contrato - Não adicionar o campo senha', async () => {
        const response = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email) {
                        token
                    }
                }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "1234526"
                }
            })

        expect(response.status).to.equal(400);
        expect(response.body.errors[0].message).to.be.equal(`Field \"login\" argument \"senha\" of type \"String!\" is required, but it was not provided.`);
        expect(response.body.errors[0].extensions.code).to.be.equal('GRAPHQL_VALIDATION_FAILED')
    })
})
