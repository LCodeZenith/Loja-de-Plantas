# 🪴 Folhagem

Loja de plantas de demonstração, feita com HTML, CSS e JavaScript puro (sem frameworks e sem etapa de build).

## Funcionalidades

- Vitrine de produtos com filtro por categoria
- Carrinho lateral com ajuste de quantidade e total
- Cadastro e login de usuário (validação de CPF, medidor de força da senha)
- Tema claro/escuro automático, conforme a preferência do sistema
- Dados do carrinho e das contas salvos no `localStorage` do navegador

## Estrutura do projeto

```
folhagem/
├── index.html            # Estrutura da página
├── css/
│   └── style.css         # Todos os estilos
├── js/
│   ├── dados.js          # Lista de produtos e chaves do localStorage
│   ├── utilitarios.js    # Funções de apoio (moeda, aviso, storage)
│   ├── estado.js         # Variáveis de estado da aplicação
│   ├── vitrine.js        # Filtros e cartões de produto
│   ├── carrinho.js       # Carrinho de compras
│   ├── autenticacao.js   # Login, cadastro e sessão
│   └── main.js           # Inicialização
├── .gitignore
└── README.md
```

> A ordem dos `<script>` no `index.html` importa: cada arquivo usa funções e variáveis dos anteriores.

## Como rodar

Basta abrir o `index.html` no navegador (duplo clique).

Se preferir um servidor local:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Como editar os produtos

Os produtos ficam em `js/dados.js`, no array `PRODUTOS`. Cada item tem:
`id`, `nome`, `categoria`, `preco`, `emoji`, `corFundo` e `descricao`.

## Publicar no GitHub Pages

1. Envie o projeto para um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.
4. Aguarde alguns minutos: o site ficará em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## ⚠️ Aviso

Este é um projeto de demonstração. Contas e senhas ficam apenas no navegador de quem usa
(o hash da senha é só ilustrativo). Em um sistema real, autenticação e pedidos devem ser
tratados em um servidor, com bcrypt/argon2 e HTTPS.
