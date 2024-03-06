const { ids_centros_de_custo } = require("./ids_centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;

function desmembrarNovoEncanto(lancamentos) {
  const novosLancamentos = [];
  const neLocal = lancamentos.filter(
    temCentroDeCusto(ids_centros_de_custo.ID_NE_LOCAL)
  );
  if (neLocal.length > 0) {
    console.log("Já existe novo encanto local nestes lançamentos");
  } else {
    lancamentos = lancamentos.map((lancamento) => {
      if (temCentroDeCusto(ids_centros_de_custo.ID_NE_GERAL)(lancamento)) {
        const descricao = lancamento.descricao;
        const parts = descricao.split("-");
        let nomeSocio = parts.length > 1 ? ` -${parts[1]}` : "";
        lancamento.descricao = "Novo Encanto Geral" + nomeSocio;
        let valorInicial = parseFloat(lancamento.valor);
        let valorNEGeral = (0.4 * valorInicial).toFixed(2);
        let valorNELocal = (valorInicial - valorNEGeral).toFixed(2);
        lancamento.valor = valorNEGeral.toString();
        const novoLancamento = {
          ...lancamento,
          id: null,
          descricao: "Novo Encanto Local" + nomeSocio,
          categoria_id: lancamento.categoria_id,
          centro_custo_lucro_id: ids_centros_de_custo.ID_NE_LOCAL,
          valor: valorNELocal.toString(),
        };
        novosLancamentos.push(novoLancamento);
      }
      return {
        ...lancamento,
      };
    });
  }
  return [...lancamentos, ...novosLancamentos];
}
exports.desmembrarNovoEncanto = desmembrarNovoEncanto;
