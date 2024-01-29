const axios = require("axios");
const querystring = require("querystring");

const apiUrl = "https://api.granatum.com.br/v1/lancamentos";

function alterar_lancamento(accessToken, id, params) {
  console.log("alterar_lancamento", { id, params });

  const url = `${apiUrl}/${id}`;
  const serializedParams = querystring.stringify(params);

  return axios
    .put(url, serializedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: { access_token: accessToken },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("ERRO", error.response.data);
    });
}
exports.alterar_lancamento = alterar_lancamento;
