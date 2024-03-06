const { ids_centros_de_custo } = require("./ids_centros_de_custo");

function formatarDadosAlteracao(lancamento, pessoa_id) {
  const dadoAlteracao = { ...lancamento };
  !dadoAlteracao.id && delete dadoAlteracao.id;
  delete dadoAlteracao.periodicidade;
  delete dadoAlteracao.itens_adicionais;
  delete dadoAlteracao.data_pagamento;
  if (dadoAlteracao.pessoa_id != pessoa_id) {
    delete dadoAlteracao.pessoa_id;
  }
  return dadoAlteracao;
}

function comporDadosAlteracao(lancamentos, dataVencimento) {
  const primeiroLancamentoDeDespesasFixas = lancamentos.find(
    (l) => l.centro_custo_lucro_id === ids_centros_de_custo.ID_DESPESAS_FIXAS
  );
  if (!primeiroLancamentoDeDespesasFixas) {
    throw "Não encontrei um lançamento de despesas fixas.";
  }
  const pessoa_id = primeiroLancamentoDeDespesasFixas.pessoa_id;
  const naoEOPrimeiro = (l) => l.id !== primeiroLancamentoDeDespesasFixas.id;
  const dadosAlteracao = {
    ...formatarDadosAlteracao(primeiroLancamentoDeDespesasFixas, pessoa_id),
    itens_adicionais: lancamentos.filter(naoEOPrimeiro).map((l) => ({
      ...formatarDadosAlteracao(l, pessoa_id),
    })),
  };
  dadosAlteracao.data_vencimento = dataVencimento;
  return { id: primeiroLancamentoDeDespesasFixas.id, dados: dadosAlteracao };
}

exports.comporDadosAlteracao = comporDadosAlteracao;
