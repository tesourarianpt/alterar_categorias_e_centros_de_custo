const { ids_categorias } = require("./ids_categorias");

const countNumFundosParticipacao = (ls) => {
  const numFundosDeParticipacao = ls.filter(
    (l) =>
      String(l.categoria_id) === String(ids_categorias.fundo_de_participacao)
  ).length;
  if (numFundosDeParticipacao === 0) {
    console.log("NÃO TEM FUNDO DE PARTICIPAÇÃO");
  }
  return numFundosDeParticipacao;
};
exports.countNumFundosParticipacao = countNumFundosParticipacao;
