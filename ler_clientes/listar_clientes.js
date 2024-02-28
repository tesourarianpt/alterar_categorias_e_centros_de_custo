const axios = require("axios");

// https://static.granatum.com.br/financeiro/api/#clientes_listar
const apiUrl = "https://api.granatum.com.br/v1/clientes";

const ID_CLASSIFICACAO_SOCIO_NPTC = 229;

function listar_clientes(accessToken, soSocios, filtros = {}) {
  const params = {
    access_token: accessToken,
    ...filtros,
  };

  return axios
    .get(apiUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params,
    })
    .then((response) => {
      if (soSocios) {
        return response.data.filter(
          (c) => c.classificacao_cliente_id === ID_CLASSIFICACAO_SOCIO_NPTC
        );
      } else {
        return response.data;
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}
exports.listar_clientes = listar_clientes;
