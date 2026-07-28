const { randomUUID } = require('crypto');
const { GraphQLError } = require('graphql');
const employeeRepository = require('../repositories/employeeRepository');
const repository = require('../repositories/payrollRepository');
const { validateCompetencia } = require('../utils/validation');

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function competenciaRange(competencia) {
  const [month, year] = competencia.split('/').map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const last = new Date(Date.UTC(year, month, 0));
  return { first, last, daysInMonth: last.getUTCDate() };
}
function toDate(value) { return new Date(`${value}T00:00:00Z`); }
function isEligible(employee, range) {
  const admission = toDate(employee.admissao);
  const dismissal = employee.desligamento ? toDate(employee.desligamento) : null;
  return admission <= range.last && (!dismissal || dismissal >= range.first);
}
function calculateBaseSalary(employee, range) {
  const admission = toDate(employee.admissao);
  const dismissal = employee.desligamento ? toDate(employee.desligamento) : null;
  const start = admission > range.first ? admission : range.first;
  const end = dismissal && dismissal < range.last ? dismissal : range.last;
  const workedDays = Math.floor((end - start) / 86400000) + 1;
  return roundMoney((employee.salario_base / range.daysInMonth) * workedDays);
}
function calculateEntries(employee, competencia, range) {
  const salary = calculateBaseSalary(employee, range);
  const inss = roundMoney(Math.min(salary * 0.15, 900));
  const irrfBase = salary - inss;
  const irrf = roundMoney(irrfBase > 5000 ? irrfBase * 0.275 : 0);
  return [
    { id: randomUUID(), funcionario_id: employee.id, tipo_valor: 1, valor: salary, competencia },
    { id: randomUUID(), funcionario_id: employee.id, tipo_valor: 2, valor: inss, competencia },
    { id: randomUUID(), funcionario_id: employee.id, tipo_valor: 3, valor: irrf, competencia }
  ];
}
function process(competencia) {
  validateCompetencia(competencia);
  if (repository.findProcessingByCompetencia(competencia)) {
    throw new GraphQLError('A competência já foi processada.', { extensions: { code: 'CONFLICT' } });
  }
  const range = competenciaRange(competencia);
  const entries = employeeRepository.findAll()
    .filter((employee) => isEligible(employee, range))
    .flatMap((employee) => calculateEntries(employee, competencia, range));
  const processing = repository.createProcessing({ id: randomUUID(), competencia, data_processamento: new Date().toISOString() });
  repository.createHistory(entries);
  return processing;
}
function cancel(competencia) {
  validateCompetencia(competencia);
  if (!repository.findProcessingByCompetencia(competencia)) {
    throw new GraphQLError('Competência não processada.', { extensions: { code: 'NOT_FOUND' } });
  }
  repository.removeByCompetencia(competencia);
  return true;
}
module.exports = { process, cancel, findHistory: repository.findHistory, findProcessings: () => require('../database').processamentos };
