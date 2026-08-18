const request = require('supertest');
const { expect } = require('chai');
const { login, loginComplete } = require('../../helpers/login');

describe('Mutation - Login', () => {
    it('Deve realizar login com sucesso quando informo credenciais validas', async () => {
        usuario = { email: "admin@admin.com", senha: "123456"}
        const response = await login(usuario);
        expect(response.status).to.equal(200);
        expect(response.body.data.login).to.be.property('token');
        expect(response.body.data.login.token).to.not.be.empty; // valida null e ''
    })

    it('Deve retornar as informacoes do usuario quando informo credenciais validas', async () => {
        usuario = { email: "admin@admin.com", senha: "123456"}
        const response = await loginComplete(usuario);
        expect(response.status).to.equal(200);
        expect(response.body.data.login).to.have.property('token').that.is.a('string').and.not.be.empty;
        expect(response.body.data.login.usuario).to.have.property('id').that.is.a('string');
        expect(response.body.data.login.usuario).to.have.property('nome').that.is.a('string');
        expect(response.body.data.login.usuario).to.have.property('email').that.is.a('string');
        expect(response.body.data.login.usuario).to.have.property('ativo').that.is.a('boolean');
    })

    it('Deve receber um erro quando informar senha invalidas', async () => {
        usuario = { email: "admin@admin.com", senha: "invalido"}
        const response = await login(usuario);
        expect(response.status).to.equal(200);
        expect(response.body.errors[0].message).to.be.equal('Credenciais inválidas ou usuário inativo.');
    })

    it('Deve receber um erro quando informar email invalido', async () => {
        usuario = { email: "adminadmin.com", senha: "123456"}
        const response = await login(usuario);
        expect(response.status).to.equal(200);
        expect(response.body.errors[0].message).to.be.equal('Credenciais inválidas ou usuário inativo.');
        expect(response.body.errors[0].extensions.code).to.be.equal('UNAUTHENTICATED')
    })
})
