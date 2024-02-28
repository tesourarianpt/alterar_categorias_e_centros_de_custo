const { centros_de_custo } = require("./centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;
const garanteQueAindaNaoTemCentroDeCustoEmergencia = (lancamentos) => {
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
};
temCentroDeCustoDespesasFixas = temCentroDeCusto(
  centros_de_custo.ID_MENSALIDADE_DESPESAS_FIXAS
);
const temAPalavraMensalidade = (d) => d.toLowerCase().includes("mensalidade");
const calcularValores = (valorInicial) => {
  const valorDespesasFixas = (0.43 * valorInicial).toFixed(2);
  const valorZelador = (0.42 * valorInicial).toFixed(2);
  const valorEmergencia = (0.03 * valorInicial).toFixed(2);
  const valorPresidencia = (
    valorInicial -
    valorDespesasFixas -
    valorZelador -
    valorEmergencia
  ).toFixed(2);

  return {
    valorDespesasFixas,
    valorZelador,
    valorEmergencia,
    valorPresidencia,
  };
};

function desmembrarMensalidade(lancamentos) {
  garanteQueAindaNaoTemCentroDeCustoEmergencia(lancamentos);
  const novosLancamentos = [];
  lancamentos = lancamentos.map((lancamento) => {
    if (
      temCentroDeCustoDespesasFixas(lancamento) &&
      temAPalavraMensalidade(lancamento.descricao)
    ) {
      const descricao = lancamento.descricao;
      const parts = descricao.split("-");
      let nomeSocio = parts.length > 1 ? ` -${parts[1]}` : "";
      lancamento.descricao = "Mensalidade:Despesas Fixas" + nomeSocio;
      const {
        valorDespesasFixas,
        valorZelador,
        valorEmergencia,
        valorPresidencia,
      } = calcularValores(parseFloat(lancamento.valor));

      lancamento.valor = valorDespesasFixas.toString();
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade:Zelador" + nomeSocio,
        centro_custo_lucro_id: centros_de_custo.ID_MENSALIDADE_ZELADOR,
        categoria_id: lancamento.categoria_id,
        valor: valorZelador.toString(),
      });
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade:Emergência" + nomeSocio,
        centro_custo_lucro_id: centros_de_custo.ID_MENSALIDADE_EMERGENCIA,
        categoria_id: lancamento.categoria_id,
        valor: valorEmergencia.toString(),
      });
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade:Presidência" + nomeSocio,
        centro_custo_lucro_id: centros_de_custo.ID_MENSALIDADE_PRESIDENCIA,
        categoria_id: lancamento.categoria_id,
        valor: valorPresidencia.toString(),
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
  const naoDesmembrou = novosLancamentos.length == 0;
  naoDesmembrou && console.log("NÃO TEM MENSALIDADE");
  return [...lancamentos, ...novosLancamentos];
}
exports.desmembrarMensalidade = desmembrarMensalidade;
