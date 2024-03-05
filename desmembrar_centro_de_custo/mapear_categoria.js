const mapeamento_de_categorias_antigas_para_suc = {
  1018655: "1998853",
  1018689: "1998859",
  1018690: "1998861",
  1018685: "1998849",
  1018692: "1998860",
  1018691: "1998857",
  1018659: "1998846",
  1018746: "1998848",
  1018694: "1998863",
  1018693: "1998862",
  1018657: "1998854",
  1475333: "1998858",
  1018641: "2010533",
  1018723: "1998852",
};

function mapear_categoria(categoria_antiga_id) {
  const categoria_mapeada =
    mapeamento_de_categorias_antigas_para_suc[categoria_antiga_id];
  const nova_categoria = categoria_mapeada
    ? categoria_mapeada
    : categoria_antiga_id;
  // console.log({ categoria_antiga_id, nova_categoria });
  return nova_categoria;
}
exports.mapear_categoria = mapear_categoria;
