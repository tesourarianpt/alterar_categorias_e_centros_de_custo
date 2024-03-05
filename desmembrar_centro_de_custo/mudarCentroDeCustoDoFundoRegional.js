const { ids_centros_de_custo } = require("./ids_centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;
const temCentroDeCustoDG = temCentroDeCusto(ids_centros_de_custo.ID_FUNDOS_DG);
const temAPalavraRegional = (d) => d.toLowerCase().includes("regional");

function mudarCentroDeCustoDoFundoRegional(lancamentos) {
  lancamentos = lancamentos.map((lancamento) => {
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
exports.mudarCentroDeCustoDoFundoRegional = mudarCentroDeCustoDoFundoRegional;
