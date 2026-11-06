/* ==========================================================
   1. DADOS DOS PRODUTOS
   Campos: id, nome, categoria, preco, emoji, corFundo, descricao
   ========================================================== */
const PRODUTOS = [
  { id: 1, nome: "Costela-de-adão",       categoria: "Grande porte",  preco: 129.9, emoji: "🌿", corFundo: "#DDEBD3", descricao: "Vaso 30 cm · luz indireta" },
  { id: 2, nome: "Espada-de-são-jorge",   categoria: "Fácil cuidado", preco: 69.9,  emoji: "🌱", corFundo: "#E5EBCB", descricao: "Vaso 20 cm · rega quinzenal" },
  { id: 3, nome: "Jiboia",                categoria: "Pendente",      preco: 49.9,  emoji: "🍃", corFundo: "#D6EADF", descricao: "Vaso 15 cm · aceita sombra" },
  { id: 4, nome: "Cacto mandacaru",       categoria: "Fácil cuidado", preco: 59.9,  emoji: "🌵", corFundo: "#F1E8C6", descricao: "Vaso 15 cm · sol pleno" },
  { id: 5, nome: "Orquídea phalaenopsis", categoria: "Flores",        preco: 89.9,  emoji: "🌸", corFundo: "#F4DDE3", descricao: "Vaso 12 cm · floresce 3 meses" },
  { id: 6, nome: "Palmeira areca",        categoria: "Grande porte",  preco: 179.9, emoji: "🌴", corFundo: "#D3E8D8", descricao: "Vaso 35 cm · 90 cm de altura" },
  { id: 7, nome: "Suculenta mix (3 un.)", categoria: "Fácil cuidado", preco: 39.9,  emoji: "🪷", corFundo: "#E0ECDD", descricao: "Vasinhos 8 cm · pouca água" },
  { id: 8, nome: "Samambaia americana",   categoria: "Pendente",      preco: 64.9,  emoji: "🌾", corFundo: "#DAEBCF", descricao: "Vaso 20 cm · gosta de umidade" }
];

const CATEGORIA_TODAS = "Todas";

/* Chaves usadas no localStorage do navegador */
const CHAVE_USUARIOS = "folhagem_usuarios";
const CHAVE_SESSAO   = "folhagem_sessao";
const CHAVE_CARRINHO = "folhagem_carrinho";
