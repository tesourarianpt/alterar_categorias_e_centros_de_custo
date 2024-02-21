const { centros_de_custo } = require("./centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;

function desmembrarMensalidade(lancamentos) {
  const emergencia = lancamentos.filter(
    temCentroDeCusto(centros_de_custo.ID_MENSALIDADE_EMERGENCIA)
  );
  if (emergencia.length > 0) {
    throw Error(
      `Já existe o centro de custo emergência nesses lançamentos - ${JSON.stringify(
        neLocal
      )}. Eles provavelmente já foram atualizados.`
    );
  }
  const novosLancamentos = [];
  lancamentos = lancamentos.map((lancamento) => {
    temCentroDeCustoDespesasFixas = temCentroDeCusto(
      centros_de_custo.ID_MENSALIDADE_DESPESAS_FIXAS
    );
    const temAPalavraMensalidade = (d) =>
      d.toLowerCase().includes("mensalidade");
    if (
      temCentroDeCustoDespesasFixas(lancamento) &&
      temAPalavraMensalidade(lancamento.descricao)
    ) {
      const descricao = lancamento.descricao;
      const parts = descricao.split("-");
      let nomeSocio = parts.length > 1 ? ` -${parts[1]}` : "";
      lancamento.descricao = "Mensalidade - Despesas Fixas" + nomeSocio;
      let valorInicial = parseFloat(lancamento.valor);
      lancamento.valor = (0.43 * valorInicial).toFixed(2).toString();
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade - Zelador" + nomeSocio,
        centro_custo_lucro_id: centros_de_custo.ID_MENSALIDADE_ZELADOR,
        categoria_id: lancamento.categoria_id,
        valor: (0.42 * valorInicial).toFixed(2).toString(),
      });
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade - Emergência" + nomeSocio,
        centro_custo_lucro_id: centros_de_custo.ID_MENSALIDADE_EMERGENCIA,
        categoria_id: lancamento.categoria_id,
        valor: (0.03 * valorInicial).toFixed(2).toString(),
      });
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade - Presidência" + nomeSocio,
        centro_custo_lucro_id: centros_de_custo.ID_MENSALIDADE_PRESIDENCIA,
        categoria_id: lancamento.categoria_id,
        valor: (0.12 * valorInicial).toFixed(2).toString(),
      });
    }
    return {
      id: lancamento.id,
      descricao: lancamento.descricao,
      centro_custo_lucro_id: lancamento.centro_custo_lucro_id,
      valor: lancamento.valor,
      categoria_id: lancamento.categoria_id,
    };
  });
  return [...lancamentos, ...novosLancamentos];
}
exports.desmembrarMensalidade = desmembrarMensalidade;
