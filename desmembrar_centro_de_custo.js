const {
  ler_lancamentos,
} = require("./alterar_categorias_e_centros_de_custo/ler_lancamentos");
const {
  agruparPorLancamentoComposto,
} = require("./alterar_categorias_e_centros_de_custo/agruparPorLancamentoComposto");
const {
  pedirAccessTokenSeNaoDefinido,
} = require("./pedirAccessTokenSeNaoDefinido");

const filtro = {
  limit: 50,
  lancamento_composto_id: 10208056,
  data_inicio: "2024-05-29",
  data_fim: "2024-05-29",
  tipo: "R|LR",
  conta_id: 75063,
};

// Fundos
// Fundos DG e RC: 141875
// Fundo Regional: 284263

const ID_NE_GERAL = 141872;
const ID_NE_LOCAL = 141871;

const filtrarLancamentoPorCentroDeCusto = (id) => (l) =>
  l.centro_custo_lucro_id == id;

function desmembrarNovoEncanto(lancamento_composto_id, lancamentos) {
  const neLocal = lancamentos.filter(
    filtrarLancamentoPorCentroDeCusto(ID_NE_LOCAL)
  );
  const neGeral = lancamentos.filter(
    filtrarLancamentoPorCentroDeCusto(ID_NE_GERAL)
  );

  if (neLocal.length > 0) {
    throw Error(
      `O lançamento ${lancamento_composto_id} já possui novo encanto Local - ${JSON.stringify(
        neLocal
      )}`
    );
  }

  neGeral.forEach((lancamento) => {});
}

async function main(accessToken) {
  const lancamentos = await ler_lancamentos(accessToken, filtro);
  console.log(`Lidos: ${lancamentos.length} lançamentos`);

  const lancamentosCompostos = agruparPorLancamentoComposto(lancamentos);
  console.log(lancamentosCompostos);

  Object.keys(lancamentosCompostos).forEach((lancamento_composto_id) => {
    // const itensAdicionais()

    const lancamentos = lancamentosCompostos[lancamento_composto_id];
    const itensAdicionais = desmembrarNovoEncanto(
      lancamento_composto_id,
      lancamentos
    );
  });

  //   console.log(lancamentos);
}

pedirAccessTokenSeNaoDefinido(main);
