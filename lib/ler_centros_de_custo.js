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
exports.ler_centros_de_custo = ler_centros_de_custo;
