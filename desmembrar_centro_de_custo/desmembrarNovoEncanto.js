const { centros_de_custo } = require("./centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;

function desmembrarNovoEncanto(lancamentos) {
  const neLocal = lancamentos.filter(
    temCentroDeCusto(centros_de_custo.ID_NE_LOCAL)
  );
  if (neLocal.length > 0) {
    throw Error(
      `Já existe novo encanto local nestes lançamentos - ${JSON.stringify(
        neLocal
      )} Eles provavelmente já foram atualizados.`
    );
  }

  const novosLancamentos = [];
  lancamentos = lancamentos.map((lancamento) => {
    if (temCentroDeCusto(centros_de_custo.ID_NE_GERAL)(lancamento)) {
      const descricao = lancamento.descricao;
      const parts = descricao.split("-");
      let nomeSocio = parts.length > 1 ? ` -${parts[1]}` : "";
      lancamento.descricao = "Novo Encanto Geral" + nomeSocio;
      let valorInicial = parseFloat(lancamento.valor);
      let valorNEGeral = (0.4 * valorInicial).toFixed(2);
      let valorNELocal = (valorInicial - valorNEGeral).toFixed(2);
      lancamento.valor = valorNEGeral.toString();
      const novoLancamento = {
        id: null,
        descricao: "Novo Encanto Local" + nomeSocio,
        categoria_id: lancamento.categoria_id,
        centro_custo_lucro_id: centros_de_custo.ID_NE_LOCAL,
        valor: valorNELocal.toString(),
      };
      novosLancamentos.push(novoLancamento);
    }
    return {
      id: lancamento.id,
      descricao: lancamento.descricao,
      centro_custo_lucro_id: lancamento.centro_custo_lucro_id,
      categoria_id: lancamento.categoria_id,
      valor: lancamento.valor,
    };
  });
  return [...lancamentos, ...novosLancamentos];
}
exports.desmembrarNovoEncanto = desmembrarNovoEncanto;
