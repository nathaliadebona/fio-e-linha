# Briefing: Fio & Linha (controle de estoque)

## Sobre o cliente (fictício)
- **Marina**, dona da Fio & Linha, loja de roupa feminina de bairro
- Vende blusas, vestidos, calças e alguns acessórios
- Hoje controla o estoque em caderno + planilha: já vendeu peça que não tinha mais e não sabe quando repor

## Problemas a resolver
- Peças anotadas de forma incompleta (falta fornecedor, data, tipo e código)
- Dar baixa é lento e, com a loja cheia, ela esquece de anotar
- Troca/devolução obriga a apagar anotação e perde o histórico
- Descobre que precisa repor tarde demais

## Visual
- Leve e aconchegante, com cara de loja artesanal
- Nada frio ou "tecnológico"

**Paleta**
- Fundo (off-white): `#FAF6F0`
- Areia (menu, cartões, linhas): `#EFE6DA`
- Terracota (botões principais e ações): `#B5532F`, hover `#9A4628`
- Verde-oliva (detalhes, preços, títulos): `#6B6F3A`
- Texto (marrom escuro): `#3B2F2A`
- Alerta de estoque baixo (ocre): `#D9A03F`
- Excluir e erros (vermelho tijolo): `#A63D2F`
- O terracota fica só para ações, para não confundir o alerta com algo clicável

**Fontes (Google Fonts)**
- Títulos: Fraunces
- Texto, tabelas e números: DM Sans

**Ícones:** Font Awesome, um por categoria (camisa, vestido, etiqueta para calça, gema para acessório)

## Quem usa
- Mais de uma pessoa trabalha na loja, então precisa de **login**
- Todos os usuários têm o mesmo acesso

## Abordagem de layout
- **Mobile-first**, com unidades em `rem`
- Dois pontos de quebra:
  - `48rem`: o menu vira barra lateral
  - `60rem`: a lista de peças vira uma linha por peça, com colunas
- Entre `48rem` e `60rem`, o menu fica na lateral e as peças continuam em cartões empilhados, para a linha nunca ficar apertada
- Os wireframes foram desenhados para desktop; o layout de celular do Histórico ainda precisa ser definido

## Menu (telas internas)
- **Celular:** barra fixa na base, com 4 itens lado a lado (Estoque, Baixa, Histórico, Sair), ícone em cima do texto
- **Desktop (≥48rem):** barra lateral de 12rem, ícone ao lado do texto, itens empilhados e centralizados na vertical
- O **Sair fica junto dos outros itens** (decisão que difere do wireframe, que o separava embaixo)
- A página atual fica destacada com uma pílula clara e `aria-current="page"`
- O conteúdo ganha espaço para não ficar escondido atrás do menu

## Telas
1. **Login** (pronta)
2. **Estoque** (pronta)
3. **Baixa** (pronta)
4. **Histórico de vendas** (a fazer)
5. **Dashboard** (parte 2)

---

## Tela: Login
- Sem menu lateral
- Título "Fio & Linha", labels visíveis, campo de senha com botão de olho que mostra e oculta a senha
- Mensagem de erro genérica: "Usuário ou senha incorretos"
- Ao entrar, o navegador guarda o token e vai para o Estoque

## Tela: Estoque

**Topo:** alerta de estoque baixo, busca com lupa, filtro por categoria e botão "+ Nova peça"

**Alerta**
- Aparece quando alguma peça tem um tamanho com 3 peças ou menos, e some quando nenhuma tem
- Olha o estoque inteiro, independente da busca e do filtro
- Tem um link "Ver peças" que abre um modal com todas as peças que têm tamanho com 3 peças ou menos, mostrando quais tamanhos estão baixos
- O modal olha o estoque inteiro, e não só a lista filtrada, porque rolar a lista não ajuda quando há várias peças com estoque baixo

**Busca e filtro**
- A busca procura por nome ou código, e funciona junto com o filtro de categoria
- A lupa é um botão sobre o campo, para quem não usa Enter

**Lista de peças**
- Cada peça mostra: ícone da categoria, nome (em cima) e código (embaixo, menor), etiquetas de tamanho com quantidade, valor de venda e botões Detalhes, Editar e Excluir (lixeira vermelha, afastada dos outros dois)
- Etiquetas em ocre e em negrito quando o tamanho tem 3 peças ou menos
- Celular: cartões empilhados
- A partir de `60rem`: uma peça por linha, com 4 colunas (nome com ícone, etiquetas, valor, botões)

**Cadastro e edição (modal)**
- O mesmo modal serve para cadastrar e editar (na edição vem preenchido, com título "Editar peça")
- A categoria é o primeiro campo e define os tamanhos disponíveis: P/M/G/GG para blusa e vestido, numeração para calça, "Único" para acessório
- A Marina marca os tamanhos que chegaram, e só aí aparece o campo de quantidade (obrigatório enquanto o tamanho está marcado)
- Demais campos: nome, cor, código, preço de custo, valor de venda, fornecedor, data de chegada
- Exige ao menos um tamanho: a mensagem aparece dentro do grupo e a tela rola até ela
- O conteúdo rola dentro do modal, com os cantos arredondados preservados

**Detalhes (modal de leitura)**
- Mostra o que o cartão não mostra: cor, preço de custo, fornecedor e data de chegada (dd/mm/aaaa)
- É um modal separado do de cadastro, para nunca mexer no estado da edição

**Excluir (modal de confirmação)**
- Pergunta com o nome da peça, com botões Cancelar e Excluir

---

## Tela: Baixa

**Estrutura (desktop):** busca + filtro no topo, resultados à esquerda, checkout à direita sempre visível

**Busca**
- Um único campo busca por **código ou nome**
- O filtro por categoria refina o resultado

**Resultados (esquerda)**
- Cada linha: nome com código, cor e etiquetas de tamanho com a quantidade em estoque
- Tamanho zerado aparece apagado
- Caixa de seleção em cada peça; ao marcar, abre um **modal** para escolher tamanho e quantidade, avisando "Há apenas __ em estoque" se passar do que existe

**Checkout (direita)**
- Três blocos: lista (rola), resumo (fixo) e botão "Dar baixa" (fixo)
- Cada linha: nome com código, cor, tamanho escolhido, quantidade editável, valor e botão de excluir
- A mesma peça em tamanhos diferentes vira linhas diferentes
- Se a Marina marcar a mesma peça no mesmo tamanho de novo, a quantidade é **somada** na linha existente (a identidade da linha é código + tamanho)
- Resumo: "itens" é a **soma das quantidades** (2 blusas = 2 itens); total em R$ é a soma de preço × quantidade

**Mensagens**
- "Há apenas __ em estoque"
- "Selecione pelo menos um produto para dar baixa"
- "Código inexistente"
- "Baixa efetuada com sucesso"
- O alerta de estoque baixo **não** aparece aqui, para não confundir com a mensagem de sucesso
- Também há uma mensagem para quando o servidor recusa a baixa porque o estoque mudou no meio da venda

**Celular e desktop**
- No celular, os resultados e o checkout ficam empilhados, e um botão redondo flutuante, acima do menu, leva até o checkout e mostra quantos itens já foram adicionados
- No desktop (≥48rem), o checkout fica ao lado da lista, grudado no alto da tela (`position: sticky`), com a lista de itens rolando por dentro e o resumo e o botão sempre à vista, e o botão flutuante some

**No servidor**
- A rota de baixa confere todas as linhas antes de mexer em qualquer uma, e só então desconta o estoque, registra a venda em `data/vendas.json` e grava os arquivos
- Cada venda guarda `id`, o usuário que a registrou (vindo do token), a data e hora e os itens, com nome, cor, preço do dia, tamanho, quantidade e `devolvida` (que começa em zero)
- O preço de cada item é lido da peça no servidor, e não do que o navegador envia, e fica congelado no dia da venda

---

## Tela: Histórico de vendas

**Estrutura:** busca + filtro no topo, cards de venda lado a lado, rolagem da página

**Lista**
- Abre mostrando os **últimos 7 dias**, com a venda mais recente primeiro
- Filtros: por dia, categoria etc., para voltar no tempo

**Cards**
- Cabeçalho: quem registrou a baixa, data e hora
- Produtos: nome, código, tamanho, cor e quantidade vendida
- Caixa de seleção em cada produto
- Não existe botão de editar venda: correções são feitas pela devolução

**Devolução**
- Ao marcar produtos (de uma ou várias vendas), aparece uma **barra fixa no canto inferior** da tela: "devolver selecionados ao estoque" + botão. Sem botão dentro dos cards.
- A barra mostra quantos produtos estão selecionados
- Abre um modal com os produtos e a quantidade a devolver, que **trava** no máximo vendido
- Cada item devolvido registra de qual venda veio e a data/hora da devolução
- Mensagem: "Produto devolvido ao estoque"

**Linha devolvida no card**
- Cor diferente + texto + ícone, sem depender só da cor: "Devolvido: 1 de 3"
- Tooltip (ao passar o mouse): data e hora da devolução e quem registrou
- A informação principal nunca fica só no tooltip, porque ele não funciona no celular nem no teclado

---

## Funcionalidades essenciais (MVP)
- Login de usuários
- Cadastro, edição e exclusão de peças com vários tamanhos, por categoria
- Lista de estoque com busca, filtro e alerta de estoque baixo (3 peças ou menos por tamanho)
- Baixa de várias peças de uma vez, com checkout
- Histórico de vendas
- Devolução registrada no histórico (parcial ou total)

## Bônus (parte 2)
- Imagem real do produto, no lugar do ícone
- **Dashboard** (quinta tela), sempre lendo dados que já existem:
  - Receita da semana e do mês
  - Lucro da semana e do mês (receita menos o custo das peças)
  - Top 5 peças mais vendidas
  - Alertas sempre à mostra, em dois níveis: estoque baixo (3 peças ou menos) e sem estoque (tamanho zerado), com cores diferentes
  - Gráfico de vendas por dia
  - Bônus do bônus: peças paradas e vendas por categoria
  - Devoluções descontam da receita e do lucro, no dia em que foram feitas

## Decisões técnicas
- Front-end: HTML, CSS e JavaScript puro, sem frameworks
- Backend: Node.js com Express, entregando a pasta `public`; os dados ficam em `data/*.json` (peças, vendas e usuários), gravados com `fs`
- Login: o servidor confere usuário e senha e entrega um token (`crypto.randomUUID`), guardado na memória do servidor (`sessoes`) e no `localStorage` do navegador
- Um middleware (`verificarToken`) protege as rotas de dados
- Rotas: `POST /api/login`, `GET /api/sessao`, `GET` e `POST /api/pecas`, `PUT` e `DELETE /api/pecas/:id`, `POST /api/baixa`
- O `global.js` funciona como porteiro nas telas internas: confere o token e manda para o Login se não valer (o Login nunca o carrega)
- Categorias e seus tamanhos: um objeto em que a categoria é a chave e os tamanhos são a lista
- Cada peça guarda `tamanhos` como um objeto (tamanho → quantidade)

## Em aberto
- Como a Marina cadastra os usuários da loja
- O que acontece com as caixas marcadas depois que a devolução é confirmada
- O que acontece no modal de cadastro se a categoria for trocada depois de preencher os tamanhos
- Emojis no lugar dos ícones (o Font Awesome gratuito não tem ícone de calça)

## Ideias para depois
- Na Baixa, a mensagem "Há apenas __ em estoque" pode mostrar quanto ainda resta para adicionar (estoque do tamanho menos o que já está no checkout), em vez do total do estoque

## Melhorias de segurança para depois
- Na rota de baixa, validar a quantidade no servidor (só inteiros positivos) e somar as linhas repetidas da mesma peça e tamanho antes de conferir o estoque
- Guardar as senhas com hash, e não em texto puro
- Rota de logout que também apague o token no servidor
- Decidir o que fazer com a pasta `data` no repositório (hoje tem peças de teste)
