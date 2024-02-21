const { centros_de_custo } = require("./centros_de_custo");

function comporDadosAlteracao(lancamentos, dataVencimento) {
  const primeiroLancamentoDeDespesasFixas = lancamentos.find(
    (l) =>
      l.centro_custo_lucro_id === centros_de_custo.ID_MENSALIDADE_DESPESAS_FIXAS
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
  return { id: primeiroLancamentoDeDespesasFixasId, dados: dadosAlteracao };
}
exports.comporDadosAlteracao = comporDadosAlteracao;
