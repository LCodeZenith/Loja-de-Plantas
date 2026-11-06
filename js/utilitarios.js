/* ==========================================================
   2. FUNÇÕES UTILITÁRIAS
   ========================================================== */

/** Atalho para document.querySelector */
const selecionar = (seletor) => document.querySelector(seletor);

/** Formata um número como moeda brasileira (ex.: 129.9 → "R$ 129,90") */
const formatarMoeda = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Retorna o primeiro nome de um nome completo */
const primeiroNome = (nomeCompleto) => nomeCompleto.split(" ")[0];

/** Leitura e gravação segura no localStorage (JSON) */
const armazenamento = {
  ler(chave, valorPadrao) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : valorPadrao;
    } catch (erro) {
      return valorPadrao;
    }
  },
  gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
      /* Ignora: armazenamento indisponível ou cheio */
    }
  }
};

/** Mostra uma mensagem rápida na parte inferior da tela */
let temporizadorAviso;
function mostrarAviso(mensagem) {
  const elementoAviso = selecionar("#aviso");
  elementoAviso.textContent = mensagem;
  elementoAviso.classList.add("ativo");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => elementoAviso.classList.remove("ativo"), 2600);
}
