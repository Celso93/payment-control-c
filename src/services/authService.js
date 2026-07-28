const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret-change-me';

async function login(email, senha) {
  const user = userRepository.findByEmail(email);
  const validPassword = user && await bcrypt.compare(senha, user.senha);
  if (!validPassword || !user.ativo) {
    throw new GraphQLError('Credenciais inválidas ou usuário inativo.', { extensions: { code: 'UNAUTHENTICATED' } });
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
  return { token, usuario: user };
}

function verifyToken(token) { return jwt.verify(token, JWT_SECRET); }
module.exports = { login, verifyToken };
