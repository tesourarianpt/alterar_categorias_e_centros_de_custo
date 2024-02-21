const {
  pedirAccessTokenSeNaoDefinido,
} = require("./pedirAccessTokenSeNaoDefinido");
const { listar_clientes } = require("./ler_clientes/listar_clientes");

async function main(accessToken) {
  const socios = await listar_clientes(accessToken, true);
  console.log(`Lidos: ${socios.length} socios`);

  socios.forEach((c) => {
    console.log(`${c.id} - ${c.nome}`);
  });
}

pedirAccessTokenSeNaoDefinido(main);

// todo:
/*
 - adicionar nome da pessoa em cada rubrica
*/
