const {
  ler_lancamentos,
} = require("./alterar_categorias_e_centros_de_custo/ler_lancamentos");
const {
  agruparPorLancamentoComposto,
} = require("./alterar_categorias_e_centros_de_custo/agruparPorLancamentoComposto");
const {
  pedirAccessTokenSeNaoDefinido,
} = require("./pedirAccessTokenSeNaoDefinido");
const {
  alterar_lancamento,
} = require("./alterar_categorias_e_centros_de_custo/alterar_lancamento");

const filtro = {
  limit: 50,
  lancamento_composto_id: 10208056,
  data_inicio: "2024-05-29",
  data_fim: "2024-05-29",
  tipo: "R|LR",
  conta_id: 75063,
};

// Fundos
const ID_FUNDOS_DG = 141875;
const ID_FUNDO_REGIONAL = 284263;

const ID_NE_GERAL = 141872;
const ID_NE_LOCAL = 141871;

const ID_MENSALIDADE_EMERGENCIA = 141876;
const ID_MENSALIDADE_DESPESAS_FIXAS = 141873;
const ID_MENSALIDADE_ZELADOR = 141874;
const ID_MENSALIDADE_PRESIDENCIA = 141866;

const temCentroDeCusto = (id) => (l) => l.centro_custo_lucro_id == id;

function desmembrarMensalidade(lancamentos) {
  const emergencia = lancamentos.filter(
    temCentroDeCusto(ID_MENSALIDADE_EMERGENCIA)
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
      ID_MENSALIDADE_DESPESAS_FIXAS
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
        centro_custo_lucro_id: ID_MENSALIDADE_ZELADOR,
        categoria_id: lancamento.categoria_id,
        valor: (0.42 * valorInicial).toFixed(2).toString(),
      });
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade - Emergência" + nomeSocio,
        centro_custo_lucro_id: ID_MENSALIDADE_EMERGENCIA,
        categoria_id: lancamento.categoria_id,
        valor: (0.03 * valorInicial).toFixed(2).toString(),
      });
      novosLancamentos.push({
        id: null,
        descricao: "Mensalidade - Presidência" + nomeSocio,
        centro_custo_lucro_id: ID_MENSALIDADE_PRESIDENCIA,
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

function desmembrarFundos(lancamentos) {
  const fundoRegional = lancamentos.filter(temCentroDeCusto(ID_FUNDO_REGIONAL));
  if (fundoRegional.length > 0) {
    throw Error(
      `Já existe novo fundo regional nestes lançamentos - ${JSON.stringify(
        neLocal
      )} Eles provavelmente já foram atualizados.`
    );
  }
  lancamentos = lancamentos.map((lancamento) => {
    const temCentroDeCustoDG = temCentroDeCusto(ID_FUNDOS_DG);
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

function desmembrarNovoEncanto(lancamentos) {
  const neLocal = lancamentos.filter(temCentroDeCusto(ID_NE_LOCAL));
  if (neLocal.length > 0) {
    throw Error(
      `Já existe novo encanto local nestes lançamentos - ${JSON.stringify(
        neLocal
      )} Eles provavelmente já foram atualizados.`
    );
  }

  const novosLancamentos = [];
  lancamentos = lancamentos.map((lancamento) => {
    if (temCentroDeCusto(ID_NE_GERAL)(lancamento)) {
      const descricao = lancamento.descricao;
      const parts = descricao.split("-");
      let nomeSocio = parts.length > 1 ? ` -${parts[1]}` : "";
      lancamento.descricao = "Novo Encanto Geral" + nomeSocio;
      let valorInicial = parseFloat(lancamento.valor);
      lancamento.valor = (0.6 * valorInicial).toFixed(2).toString();
      const novoLancamento = {
        id: null,
        descricao: "Novo Encanto Local" + nomeSocio,
        categoria_id: lancamento.categoria_id,
        centro_custo_lucro_id: ID_NE_LOCAL,
        valor: (0.6 * valorInicial).toFixed(2).toString(),
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

async function main(accessToken) {
  const lancamentos = await ler_lancamentos(accessToken, filtro);
  // console.log(`Lidos: ${lancamentos.length} lançamentos`);

  const lancamentosCompostos = agruparPorLancamentoComposto(lancamentos);

  Object.keys(lancamentosCompostos).forEach((lancamento_composto_id) => {
    // const itensAdicionais()

    let lancamentos = lancamentosCompostos[lancamento_composto_id];
    const dataVencimento = lancamentos[0].data_vencimento;
    lancamentos = desmembrarNovoEncanto(lancamentos);
    lancamentos = desmembrarFundos(lancamentos);
    lancamentos = desmembrarMensalidade(lancamentos);

    const primeiroLancamentoDeDespesasFixas = lancamentos.find(
      (l) => l.centro_custo_lucro_id === ID_MENSALIDADE_DESPESAS_FIXAS
    );
    if (!primeiroLancamentoDeDespesasFixas) {
      throw "Não encontrei um lançamento de despesas fixas.";
    }
    const primeiroLancamentoDeDespesasFixasId =
      primeiroLancamentoDeDespesasFixas.id;
    const naoEOPrimeiro = (l) => l.id !== primeiroLancamentoDeDespesasFixasId;
    const dadosAlteracao = {
      centro_custo_lucro_id:
        primeiroLancamentoDeDespesasFixas.centro_custo_lucro_id,
      valor: primeiroLancamentoDeDespesasFixas.valor,
      descricao: primeiroLancamentoDeDespesasFixas.descricao,
      categoria_id: primeiroLancamentoDeDespesasFixas.categoria_id,
      itens_adicionais: lancamentos.filter(naoEOPrimeiro).map((l) => {
        const payload = {
          centro_custo_lucro_id: l.centro_custo_lucro_id,
          valor: l.valor,
          descricao: l.descricao,
          categoria_id: l.categoria_id,
        };
        if (l.id) {
          payload.id = l.id;
        }
        return payload;
      }),
    };
    dadosAlteracao.data_vencimento = dataVencimento;

    console.log(dadosAlteracao);
    // console.log(dadosAlteracao);

    alterar_lancamento(
      accessToken,
      primeiroLancamentoDeDespesasFixasId,
      dadosAlteracao
    );
  });
}

pedirAccessTokenSeNaoDefinido(main);
