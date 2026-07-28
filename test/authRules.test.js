const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/database');
const authService = require('../src/services/authService');
const resolvers = require('../src/graphql/resolvers');

test('inicia com administrador e permite seu login', async () => {
  const admin = db.usuarios.find((user) => user.email === 'admin@admin.com');
  assert.deepEqual({ email: admin.email, nome: admin.nome, ativo: admin.ativo }, { email: 'admin@admin.com', nome: 'ADMIN', ativo: true });
  const result = await authService.login('admin@admin.com', '123456');
  assert.equal(result.usuario.id, admin.id);
  assert.ok(result.token);
});

test('bloqueia a edição de outro usuário', () => {
  assert.throws(
    () => resolvers.Mutation.atualizarUsuario(null, { id: 'outro-id', input: { nome: 'Outro' } }, { user: db.usuarios[0] }),
    (error) => error.extensions.code === 'FORBIDDEN'
  );
});
