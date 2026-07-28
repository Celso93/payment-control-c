const { usuarios } = require('../database');

function findById(id) { return usuarios.find((user) => user.id === id) || null; }
function findByEmail(email) { return usuarios.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null; }
function findAll() { return usuarios; }
function create(user) { usuarios.push(user); return user; }
function update(id, changes) {
  const user = findById(id);
  if (!user) return null;
  Object.assign(user, changes);
  return user;
}
function count() { return usuarios.length; }

module.exports = { findById, findByEmail, findAll, create, update, count };
