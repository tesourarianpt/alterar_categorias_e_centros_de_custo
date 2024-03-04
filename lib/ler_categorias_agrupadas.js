const axios = require("axios");

const apiUrl = "https://api.granatum.com.br/v1/categorias";

function ler_categorias(accessToken) {
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

const ler_categorias_agrupadas = async (accessToken) => {
  const categorias = await ler_categorias(accessToken);
  return categorias.reduce(
    (categorias, categoria) => ({
      ...categorias,
      [categoria.id]: categoria.descricao,
    }),
    {}
  );
};
exports.ler_categorias_agrupadas = ler_categorias_agrupadas;
