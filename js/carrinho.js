/* ==========================================================
   5. CARRINHO DE COMPRAS
   ========================================================== */

/** Salva o carrinho no navegador e atualiza a tela */
function salvarCarrinho() {
  armazenamento.gravar(CHAVE_CARRINHO, carrinho);
  renderizarCarrinho();
}

/** Desenha os itens, o total e o contador do carrinho */
function renderizarCarrinho() {
  // Só considera itens com quantidade > 0 e que ainda existam no catálogo
  const idsNoCarrinho = Object.keys(carrinho).filter(
    (id) => carrinho[id] > 0 && PRODUTOS.some((produto) => produto.id === Number(id))
  );

  let valorTotal = 0;
  let quantidadeTotal = 0;

  const htmlItens = idsNoCarrinho.map((id) => {
    const produto = PRODUTOS.find((p) => p.id === Number(id));
    const quantidade = carrinho[id];

    valorTotal += produto.preco * quantidade;
    quantidadeTotal += quantidade;

    return `
      <div class="item-carrinho">
        <span class="emoji">${produto.emoji}</span>
        <div>
          <strong>${produto.nome}</strong>
          <div class="quantidade">
            <button data-variacao="-1" data-id="${id}" aria-label="Diminuir">−</button>
            ${quantidade}
            <button data-variacao="1" data-id="${id}" aria-label="Aumentar">+</button>
          </div>
        </div>
        <strong>${formatarMoeda(produto.preco * quantidade)}</strong>
      </div>`;
  }).join("");

  selecionar("#itensCarrinho").innerHTML = idsNoCarrinho.length
    ? htmlItens
    : '<p class="carrinho-vazio">Seu carrinho está vazio. Escolha uma planta para começar.</p>';

  selecionar("#totalCarrinho").textContent = formatarMoeda(valorTotal);
  selecionar("#contadorItens").textContent = quantidadeTotal;
  selecionar("#botaoFinalizarCompra").disabled = !quantidadeTotal;
}

/** Abre (true) ou fecha (false) o carrinho lateral */
function abrirCarrinho(aberto) {
  selecionar("#carrinhoLateral").classList.toggle("ativo", aberto);
  selecionar("#carrinhoLateral").setAttribute("aria-hidden", !aberto);
  selecionar("#fundoEscuro").classList.toggle("ativo", aberto);
}

/* Botões + e − dentro do carrinho */
selecionar("#itensCarrinho").addEventListener("click", (evento) => {
  const id = evento.target.dataset.id;
  if (id) {
    carrinho[id] += Number(evento.target.dataset.variacao);
    if (carrinho[id] <= 0) delete carrinho[id];
    salvarCarrinho();
  }
});

/* Abrir e fechar o carrinho */
selecionar("#botaoCarrinho").onclick = () => abrirCarrinho(true);
selecionar("#botaoFecharCarrinho").onclick = () => abrirCarrinho(false);
selecionar("#fundoEscuro").onclick = () => abrirCarrinho(false);

/* Finalizar compra: exige login; se logado, confirma o pedido e esvazia o carrinho */
selecionar("#botaoFinalizarCompra").onclick = () => {
  if (!sessao) {
    abrirCarrinho(false);
    abrirDialogoConta("cadastro");
    mostrarAviso("Crie sua conta para finalizar a compra");
    return;
  }

  const quantidadeItens = Object.values(carrinho).reduce((soma, qtd) => soma + qtd, 0);
  carrinho = {};
  salvarCarrinho();
  abrirCarrinho(false);
  mostrarAviso(`Pedido confirmado, ${primeiroNome(sessao.nome)}! ${quantidadeItens} item(ns) a caminho.`);
};
