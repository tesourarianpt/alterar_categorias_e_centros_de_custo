const { centros_de_custo } = require("./centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;

function desmembrarFundos(lancamentos) {
  const fundoRegional = lancamentos.filter(
    temCentroDeCusto(centros_de_custo.ID_FUNDO_REGIONAL)
  );
  if (fundoRegional.length > 0) {
    throw Error(
      `Já existe novo fundo regional nestes lançamentos - ${JSON.stringify(
        neLocal
      )} Eles provavelmente já foram atualizados.`
    );
  }
  lancamentos = lancamentos.map((lancamento) => {
    const temCentroDeCustoDG = temCentroDeCusto(centros_de_custo.ID_FUNDOS_DG);
    const temAPalavraRegional = (d) => d.toLowerCase().includes("regional");
    if (
      temCentroDeCustoDG(lancamento) &&
      temAPalavraRegional(lancamento.descricao)
    ) {
      lancamento.centro_custo_lucro_id = 284263;
    }
    return lancamento;
  });
  return lancamentos;
}
exports.desmembrarFundos = desmembrarFundos;
