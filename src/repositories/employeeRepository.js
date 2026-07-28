const { funcionarios } = require('../database');

function findById(id) { return funcionarios.find((employee) => employee.id === id) || null; }
function findByCpf(cpf) { return funcionarios.find((employee) => employee.cpf === cpf) || null; }
function findAll() { return funcionarios; }
function create(employee) { funcionarios.push(employee); return employee; }
function update(id, changes) {
  const employee = findById(id);
  if (!employee) return null;
  Object.assign(employee, changes);
  return employee;
}
function remove(id) {
  const index = funcionarios.findIndex((employee) => employee.id === id);
  if (index === -1) return false;
  funcionarios.splice(index, 1);
  return true;
}

module.exports = { findById, findByCpf, findAll, create, update, remove };
