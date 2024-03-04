const axios = require("axios");

const apiUrl = "https://api.granatum.com.br/v1/centros_custo_lucro";

function ler_centros_de_custo(accessToken) {
  const params = {
    access_token: accessToken,
    considerar_inativos: true,
    tipo_view: "children",
  };

  return axios
    .get(apiUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

const ler_centros_de_custo_agrupados = async (accessToken) => {
  const centros_de_custo = await ler_centros_de_custo(accessToken);
  return centros_de_custo.reduce(
    (centros, centro) => ({ ...centros, [centro.id]: centro.descricao }),
    {}
  );
};
exports.ler_centros_de_custo_agrupados = ler_centros_de_custo_agrupados;
