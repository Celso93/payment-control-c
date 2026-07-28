const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/database');
const employeeService = require('../src/services/employeeService');
const payrollService = require('../src/services/payrollService');

function clearDatabase() {
  db.funcionarios.length = 0;
  db.processamentos.length = 0;
  db.historicosFuncionarios.length = 0;
}

test('processa proporcionais, descontos e anulação da competência', () => {
  clearDatabase();
  const admitted = employeeService.create({ cpf: '111', nome: 'Admitido', salario_base: 10000, admissao: '2026-07-16' });
  const dismissed = employeeService.create({ cpf: '222', nome: 'Desligado', salario_base: 3100, admissao: '2020-01-01', desligamento: '2026-07-10' });
  const highSalary = employeeService.create({ cpf: '444', nome: 'Salário Alto', salario_base: 10000, admissao: '2020-01-01' });
  employeeService.create({ cpf: '333', nome: 'Futuro', salario_base: 1000, admissao: '2026-08-01' });

  const processing = payrollService.process('07/2026');
  assert.equal(processing.competencia, '07/2026');
  const history = payrollService.findHistory({ competencia: '07/2026' });
  assert.equal(history.length, 9);

  const salary = history.find((entry) => entry.funcionario_id === admitted.id && entry.tipo_valor === 1);
  const inss = history.find((entry) => entry.funcionario_id === admitted.id && entry.tipo_valor === 2);
  const highSalaryInss = history.find((entry) => entry.funcionario_id === highSalary.id && entry.tipo_valor === 2);
  const highSalaryIrrf = history.find((entry) => entry.funcionario_id === highSalary.id && entry.tipo_valor === 3);
  const dismissedSalary = history.find((entry) => entry.funcionario_id === dismissed.id && entry.tipo_valor === 1);
  assert.equal(salary.valor, 5161.29); // 16 dias de 31
  assert.equal(inss.valor, 774.19);
  assert.equal(highSalaryInss.valor, 900);
  assert.equal(highSalaryIrrf.valor, 2502.5);
  assert.equal(dismissedSalary.valor, 1000);

  assert.equal(payrollService.cancel('07/2026'), true);
  assert.equal(payrollService.findHistory({ competencia: '07/2026' }).length, 0);
  assert.equal(db.processamentos.length, 0);
});
