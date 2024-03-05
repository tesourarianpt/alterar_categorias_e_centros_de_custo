const { ids_centros_de_custo } = require("./ids_centros_de_custo");

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;
const jaTemCentroDeCustoEmergencia = (lancamentos) => {
  const emergencia = lancamentos.filter(
    temCentroDeCusto(ids_centros_de_custo.ID_EMERGENCIA)
  );
  return emergencia.length > 0;
};
temCentroDeCustoDespesasFixas = temCentroDeCusto(
  ids_centros_de_custo.ID_DESPESAS_FIXAS
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
  if (jaTemCentroDeCustoEmergencia(lancamentos)) {
    console.log(
      "já tem item no novo centro de custo de emergência. Provavelmente as mensalidades já foram desmembradas."
    );
    return lancamentos;
  } else {
    const novosLancamentos = [];
    lancamentos = lancamentos.map((lancamento) => {
      if (
        temCentroDeCustoDespesasFixas(lancamento) &&
        temAPalavraMensalidade(lancamento.descricao)
      ) {
        const descricao = lancamento.descricao;
        const parts = descricao.split("-");
        let nomeSocio = parts.length > 1 ? ` -${parts[1]}` : "";
        lancamento.descricao = "Mensalidade : Despesas Fixas" + nomeSocio;
        const {
          valorDespesasFixas,
          valorZelador,
          valorEmergencia,
          valorPresidencia,
        } = calcularValores(parseFloat(lancamento.valor));

        lancamento.valor = valorDespesasFixas.toString();
        novosLancamentos.push({
          ...lancamento,
          id: null,
          descricao: "Mensalidade : Zelador" + nomeSocio,
          centro_custo_lucro_id: ids_centros_de_custo.ID_ZELADOR,
          valor: valorZelador.toString(),
        });
        novosLancamentos.push({
          ...lancamento,
          id: null,
          descricao: "Mensalidade : Emergência" + nomeSocio,
          centro_custo_lucro_id: ids_centros_de_custo.ID_EMERGENCIA,
          valor: valorEmergencia.toString(),
        });
        novosLancamentos.push({
          ...lancamento,
          id: null,
          descricao: "Mensalidade : Presidência" + nomeSocio,
          centro_custo_lucro_id: ids_centros_de_custo.ID_PRESIDENCIA,
          valor: valorPresidencia.toString(),
        });
      }
      return lancamento;
    });
    const naoDesmembrou = novosLancamentos.length == 0;
    naoDesmembrou && console.log("NÃO TEM MENSALIDADE");
    return [...lancamentos, ...novosLancamentos];
  }
}
exports.desmembrarMensalidade = desmembrarMensalidade;
