const { processamentos, historicosFuncionarios } = require('../database');

function findProcessingByCompetencia(competencia) {
  return processamentos.find((item) => item.competencia === competencia) || null;
}
function createProcessing(processing) { processamentos.push(processing); return processing; }
function createHistory(entries) { historicosFuncionarios.push(...entries); return entries; }
function findHistory({ competencia, funcionarioId } = {}) {
  return historicosFuncionarios.filter((item) =>
    (!competencia || item.competencia === competencia) && (!funcionarioId || item.funcionario_id === funcionarioId));
}
function removeByCompetencia(competencia) {
  const processingIndex = processamentos.findIndex((item) => item.competencia === competencia);
  if (processingIndex !== -1) processamentos.splice(processingIndex, 1);
  for (let i = historicosFuncionarios.length - 1; i >= 0; i -= 1) {
    if (historicosFuncionarios[i].competencia === competencia) historicosFuncionarios.splice(i, 1);
  }
}

module.exports = { findProcessingByCompetencia, createProcessing, createHistory, findHistory, removeByCompetencia };
