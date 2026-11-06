/* ==========================================================
   4. VITRINE (FILTROS E CARTÕES DE PRODUTO)
   ========================================================== */

/** Desenha os botões de filtro por categoria */
function renderizarFiltros() {
  const categorias = [CATEGORIA_TODAS, ...new Set(PRODUTOS.map((produto) => produto.categoria))];

  selecionar("#filtros").innerHTML = categorias
    .map((categoria) => `
      <button class="filtro"
              aria-pressed="${categoria === categoriaAtiva}"
              data-categoria="${categoria}">${categoria}</button>`)
    .join("");
}

/** Desenha os cartões dos produtos da categoria selecionada */
function renderizarProdutos() {
  const produtosVisiveis = PRODUTOS.filter(
    (produto) => categoriaAtiva === CATEGORIA_TODAS || produto.categoria === categoriaAtiva
  );

  selecionar("#gradeProdutos").innerHTML = produtosVisiveis
    .map((produto) => `
      <article class="cartao-produto">
        <div class="imagem" style="--cor-fundo-planta:${produto.corFundo}" aria-hidden="true">${produto.emoji}</div>
        <div class="corpo">
          <h3>${produto.nome}</h3>
          <small>${produto.descricao}</small>
          <div class="linha-preco">
            <span class="preco">${formatarMoeda(produto.preco)}</span>
            <button class="botao" data-adicionar="${produto.id}">Adicionar</button>
          </div>
        </div>
      </article>`)
    .join("");
}

/* Clique em um filtro de categoria */
selecionar("#filtros").addEventListener("click", (evento) => {
  const categoria = evento.target.dataset.categoria;
  if (categoria) {
    categoriaAtiva = categoria;
    renderizarFiltros();
    renderizarProdutos();
  }
});

/* Clique em "Adicionar" em um produto */
selecionar("#gradeProdutos").addEventListener("click", (evento) => {
  const idProduto = evento.target.dataset.adicionar;
  if (idProduto) {
    carrinho[idProduto] = (carrinho[idProduto] || 0) + 1;
    salvarCarrinho();
    mostrarAviso("Adicionado ao carrinho");
  }
});
