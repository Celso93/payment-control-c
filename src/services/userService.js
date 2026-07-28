const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const { GraphQLError } = require('graphql');
const repository = require('../repositories/userRepository');
const { badRequest, validateEmail } = require('../utils/validation');

function validateRequired(input) {
  if (!input.nome?.trim() || !input.email?.trim() || !input.senha) throw badRequest('Nome, e-mail e senha são obrigatórios.');
  validateEmail(input.email);
  if (input.senha.length < 6) throw badRequest('A senha deve possuir no mínimo 6 caracteres.');
}
async function create(input) {
  validateRequired(input);
  if (repository.findByEmail(input.email)) throw badRequest('Já existe usuário com este e-mail.');
  return repository.create({ id: randomUUID(), nome: input.nome.trim(), email: input.email.trim().toLowerCase(), senha: await bcrypt.hash(input.senha, 10), ativo: input.ativo ?? true });
}
async function update(id, input) {
  const existing = repository.findById(id);
  if (!existing) throw new GraphQLError('Usuário não encontrado.', { extensions: { code: 'NOT_FOUND' } });
  const changes = {};
  if (input.nome !== undefined) { if (!input.nome.trim()) throw badRequest('Nome não pode ser vazio.'); changes.nome = input.nome.trim(); }
  if (input.email !== undefined) { validateEmail(input.email); const owner = repository.findByEmail(input.email); if (owner && owner.id !== id) throw badRequest('Já existe usuário com este e-mail.'); changes.email = input.email.trim().toLowerCase(); }
  if (input.senha !== undefined) { if (input.senha.length < 6) throw badRequest('A senha deve possuir no mínimo 6 caracteres.'); changes.senha = await bcrypt.hash(input.senha, 10); }
  if (input.ativo !== undefined) changes.ativo = input.ativo;
  return repository.update(id, changes);
}
module.exports = { create, update, findAll: repository.findAll, findById: repository.findById };
