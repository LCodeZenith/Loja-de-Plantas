/* ==========================================================
   6. AUTENTICAÇÃO (LOGIN, CADASTRO E SESSÃO)
   ========================================================== */

/* ---------- 6.1 Funções de apoio ---------- */

/**
 * Gera o hash SHA-256 da senha (com um prefixo fixo).
 * Se o navegador não suportar crypto.subtle, usa Base64 como alternativa.
 * ATENÇÃO: é apenas uma demonstração; em produção a senha deve ser
 * tratada no servidor com bcrypt/argon2 e salt individual.
 */
async function gerarHashSenha(senha) {
  try {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("folhagem:" + senha));
    return [...new Uint8Array(buffer)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch (erro) {
    return btoa(unescape(encodeURIComponent(senha)));
  }
}

/** Valida um CPF (11 dígitos, rejeita repetidos e confere os 2 dígitos verificadores) */
function validarCpf(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) return false;

  const digitos = cpfLimpo.split("").map(Number);

  for (let posicaoVerificador = 9; posicaoVerificador < 11; posicaoVerificador++) {
    let soma = 0;
    for (let i = 0; i < posicaoVerificador; i++) {
      soma += digitos[i] * (posicaoVerificador + 1 - i);
    }
    if ((soma * 10 % 11) % 10 !== digitos[posicaoVerificador]) return false;
  }
  return true;
}

/**
 * Mostra (ou limpa) a mensagem de erro de um campo.
 * Retorna true se o campo está válido (sem mensagem).
 */
function mostrarErroCampo(idCampo, mensagem) {
  const campo = selecionar("#" + idCampo);
  campo.setAttribute("aria-invalid", !!mensagem);
  document.querySelector(`[data-campo="${idCampo}"]`).textContent = mensagem || "";
  return !mensagem;
}

/* ---------- 6.2 Interface (cabeçalho e diálogo) ---------- */

/** Atualiza saudação e texto do botão Entrar/Sair conforme a sessão */
function renderizarAutenticacao() {
  selecionar("#saudacao").classList.toggle("oculto", !sessao);
  selecionar("#saudacao").textContent = sessao ? `Olá, ${primeiroNome(sessao.nome)}` : "";
  selecionar("#botaoAutenticacao").textContent = sessao ? "Sair" : "Entrar";
}

/** Alterna entre as abas "login" e "cadastro" */
function alternarAba(aba) {
  const ehCadastro = aba === "cadastro";
  selecionar("#formularioCadastro").classList.toggle("oculto", !ehCadastro);
  selecionar("#formularioLogin").classList.toggle("oculto", ehCadastro);
  selecionar("#abaCadastro").setAttribute("aria-selected", ehCadastro);
  selecionar("#abaEntrar").setAttribute("aria-selected", !ehCadastro);
}

/** Abre o diálogo de conta já na aba desejada */
function abrirDialogoConta(aba) {
  alternarAba(aba);
  if (!selecionar("#dialogoConta").open) selecionar("#dialogoConta").showModal();
}

selecionar("#abaEntrar").onclick = () => alternarAba("login");
selecionar("#abaCadastro").onclick = () => alternarAba("cadastro");
selecionar("#botaoFecharDialogo").onclick = () => selecionar("#dialogoConta").close();

/* Botão do cabeçalho: "Sair" se estiver logado, "Entrar" caso contrário */
selecionar("#botaoAutenticacao").onclick = () => {
  if (sessao) {
    sessao = null;
    armazenamento.gravar(CHAVE_SESSAO, null);
    renderizarAutenticacao();
    mostrarAviso("Você saiu da conta");
  } else {
    abrirDialogoConta("login");
  }
};

/* ---------- 6.3 Campos do formulário de cadastro ---------- */

/* Máscara automática do CPF: 000.000.000-00 */
selecionar("#cadastroCpf").addEventListener("input", (evento) => {
  const digitos = evento.target.value.replace(/\D/g, "").slice(0, 11);
  evento.target.value = digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

/* Medidor de força da senha (0 a 4 pontos) */
selecionar("#cadastroSenha").addEventListener("input", (evento) => {
  const senha = evento.target.value;
  let pontuacao = 0;

  if (senha.length >= 6) pontuacao++;                           // tamanho mínimo
  if (senha.length >= 10) pontuacao++;                          // senha longa
  if (/[A-Z]/.test(senha) && /\d/.test(senha)) pontuacao++;     // maiúscula + número
  if (/[^\w]/.test(senha)) pontuacao++;                         // caractere especial

  const coresPorPontuacao = [
    "var(--cor-erro)",
    "var(--cor-erro)",
    "var(--cor-destaque)",
    "var(--cor-marca)",
    "var(--cor-marca)"
  ];

  const barra = selecionar("#medidorSenha");
  barra.style.width = (pontuacao * 25) + "%";
  barra.style.background = coresPorPontuacao[pontuacao];
});

/* ---------- 6.4 Envio dos formulários ---------- */

/* Cadastro de nova conta */
selecionar("#formularioCadastro").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome   = selecionar("#cadastroNome").value.trim();
  const email  = selecionar("#cadastroEmail").value.trim().toLowerCase();
  const cpf    = selecionar("#cadastroCpf").value;
  const senha  = selecionar("#cadastroSenha").value;
  const senha2 = selecionar("#cadastroConfirmarSenha").value;

  // Roda TODAS as validações (para mostrar todos os erros de uma vez)
  let tudoValido = true;

  tudoValido = mostrarErroCampo("cadastroNome",
    nome.split(/\s+/).length < 2 ? "Digite nome e sobrenome." : ""
  ) && tudoValido;

  tudoValido = mostrarErroCampo("cadastroEmail",
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "Digite um e-mail válido."
    : usuarios.some((usuario) => usuario.email === email) ? "Este e-mail já tem cadastro. Use a aba Entrar."
    : ""
  ) && tudoValido;

  tudoValido = mostrarErroCampo("cadastroCpf",
    !validarCpf(cpf) ? "CPF inválido. Confira os 11 dígitos."
    : usuarios.some((usuario) => usuario.cpf === cpf) ? "Este CPF já tem cadastro."
    : ""
  ) && tudoValido;

  tudoValido = mostrarErroCampo("cadastroSenha",
    senha.length < 6 ? "A senha precisa de pelo menos 6 caracteres." : ""
  ) && tudoValido;

  tudoValido = mostrarErroCampo("cadastroConfirmarSenha",
    senha !== senha2 ? "As senhas não são iguais." : ""
  ) && tudoValido;

  if (!tudoValido) return;

  // Salva o novo usuário e já inicia a sessão
  usuarios.push({ nome, email, cpf, senha: await gerarHashSenha(senha) });
  armazenamento.gravar(CHAVE_USUARIOS, usuarios);

  sessao = { nome, email };
  armazenamento.gravar(CHAVE_SESSAO, sessao);

  selecionar("#formularioCadastro").reset();
  selecionar("#medidorSenha").style.width = "0";
  selecionar("#dialogoConta").close();
  renderizarAutenticacao();
  mostrarAviso(`Conta criada. Bem-vinda(o), ${primeiroNome(nome)}!`);
});

/* Login de conta existente */
selecionar("#formularioLogin").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = selecionar("#loginEmail").value.trim().toLowerCase();
  const hashSenha = await gerarHashSenha(selecionar("#loginSenha").value);

  const usuario = usuarios.find((u) => u.email === email && u.senha === hashSenha);

  if (!usuario) {
    selecionar("#loginErro").textContent = "E-mail ou senha incorretos. Confira os dados ou crie uma conta.";
    return;
  }

  selecionar("#loginErro").textContent = "";
  sessao = { nome: usuario.nome, email: usuario.email };
  armazenamento.gravar(CHAVE_SESSAO, sessao);

  selecionar("#formularioLogin").reset();
  selecionar("#dialogoConta").close();
  renderizarAutenticacao();
  mostrarAviso(`Olá de novo, ${primeiroNome(usuario.nome)}!`);
});
