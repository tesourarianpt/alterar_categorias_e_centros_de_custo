const CATEGORIA_ID_FUNDO_PARTICIPACAO = 1018689;

const countNumFundosParticipacao = (ls) => {
  const numFundosDeParticipacao = ls.filter(
    (l) => l.categoria_id === CATEGORIA_ID_FUNDO_PARTICIPACAO
  ).length;
  if (numFundosDeParticipacao === 0) {
    console.log("NÃO TEM FUNDO DE PARTICIPAÇÃO");
  }
  return numFundosDeParticipacao;
};
exports.countNumFundosParticipacao = countNumFundosParticipacao;
