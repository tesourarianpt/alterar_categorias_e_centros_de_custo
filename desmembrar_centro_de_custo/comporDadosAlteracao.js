const { centros_de_custo } = require("./centros_de_custo");

function formatarDadosAlteracao(lancamento) {
  return lancamento.id
    ? {
        id: lancamento.id,
        centro_custo_lucro_id: lancamento.centro_custo_lucro_id,
        valor: lancamento.valor,
        descricao: lancamento.descricao,
        categoria_id: lancamento.categoria_id,
      }
    : lancamento;
}

function comporDadosAlteracao(lancamentos, dataVencimento) {
  const primeiroLancamentoDeDespesasFixas = lancamentos.find(
    (l) =>
      l.centro_custo_lucro_id === centros_de_custo.ID_MENSALIDADE_DESPESAS_FIXAS
  );
  if (!primeiroLancamentoDeDespesasFixas) {
    throw "Não encontrei um lançamento de despesas fixas.";
  }
  console.log("......");
  const naoEOPrimeiro = (l) => l.id !== primeiroLancamentoDeDespesasFixas.id;
  const dadosAlteracao = {
    ...formatarDadosAlteracao(primeiroLancamentoDeDespesasFixas),
    itens_adicionais: lancamentos.filter(naoEOPrimeiro).map((l) => ({
      ...formatarDadosAlteracao(l),
    })),
  };
  dadosAlteracao.data_vencimento = dataVencimento;
  return { id: primeiroLancamentoDeDespesasFixas.id, dados: dadosAlteracao };
}

exports.comporDadosAlteracao = comporDadosAlteracao;
