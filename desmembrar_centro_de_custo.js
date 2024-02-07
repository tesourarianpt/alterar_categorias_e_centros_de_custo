const {
  ler_lancamentos,
} = require("./alterar_categorias_e_centros_de_custo/ler_lancamentos");

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

async function main(accessToken) {
  const lancamentos = await ler_lancamentos(accessToken, filtro);
  console.log(`Lidos: ${lancamentos.length} lançamentos`);
  //   console.log(lancamentos);
}

pedirAccessTokenSeNaoDefinido(main);
