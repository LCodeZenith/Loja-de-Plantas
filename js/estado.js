/* ==========================================================
   3. ESTADO DA APLICAÇÃO
   ========================================================== */
let usuarios        = armazenamento.ler(CHAVE_USUARIOS, []);    // lista de contas cadastradas
let sessao          = armazenamento.ler(CHAVE_SESSAO, null);    // usuário logado: { nome, email }
let carrinho        = armazenamento.ler(CHAVE_CARRINHO, {});    // { idProduto: quantidade }
let categoriaAtiva  = CATEGORIA_TODAS;                          // filtro selecionado na vitrine

if (!Array.isArray(usuarios)) usuarios = [];
