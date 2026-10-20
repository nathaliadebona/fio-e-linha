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
- Paleta: off-white, terracota e verde-oliva
- Nada frio ou "tecnológico"
- Destaque de ações importantes em terracota; excluir em vermelho mais fechado (tom tijolo)

## Quem usa
- Mais de uma pessoa trabalha na loja, então precisa de **login**
- Todos os usuários têm o mesmo acesso

## Estrutura geral
- Menu lateral nas telas internas: Estoque, Baixa, Histórico e, separado lá embaixo, Sair
- Layout pensado primeiro para desktop; versão para celular a definir

---

## Tela: Login
- Sem menu lateral
- Labels visíveis: Usuário e Senha, botão Entrar
- Mensagem de erro genérica, sem revelar qual dado errou: "Usuário ou senha incorretos"

## Tela: Estoque

**Estrutura:** alerta no topo, busca + filtro + botão "+ Nova peça" (terracota), e a lista abaixo

**Cadastro e edição (modal)**
- O modal é o mesmo para cadastrar e editar (na edição, já vem preenchido)
- A **categoria é o primeiro campo**, escolhida de uma lista (blusa, vestido, calça, acessório)
- Os tamanhos dependem da categoria: P/M/G/GG para roupas, numeração para calças, "Único" para acessórios
- A Marina clica nos tamanhos que chegaram, e só então aparece o campo de quantidade de cada um
- Demais campos: nome, cor, código (por tipo + cor), preço de custo, valor de venda, fornecedor, data de chegada
- O conteúdo rola dentro do modal, com o botão de salvar sempre visível
- Imagem do produto fica fora do essencial (bônus)

**Lista de produtos**
- Ícone da categoria, nome com código, etiquetas de tamanho com quantidade (ex.: P 2 · M 1 · G 3), valor de venda
- Botões: detalhes, editar, excluir (ícone de lixeira vermelha, com `aria-label`)
- Excluir sempre pede confirmação

**Alerta**
- Faixa no topo: "Você tem produtos com baixa quantidade em estoque", com botão que leva à lista
- Etiqueta de tamanho em terracota quando houver **3 peças ou menos**

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
- Cadastro de peças com vários tamanhos, por categoria
- Lista de estoque com alerta de estoque baixo (3 peças ou menos por tamanho)
- Baixa de várias peças de uma vez, com checkout
- Histórico de vendas
- Devolução registrada no histórico (parcial ou total)

## Bônus (parte 2)
- Imagem real do produto, no lugar do ícone
- Filtro por tipo de peça na lista de estoque
- **Dashboard** (quinta tela), sempre lendo dados que já existem:
  - Receita da semana e do mês
  - Lucro da semana e do mês (receita menos o custo das peças)
  - Top 5 peças mais vendidas
  - Alertas sempre à mostra, em dois níveis: estoque baixo (3 peças ou menos) e sem estoque (tamanho zerado), com cores diferentes
  - Gráfico de vendas por dia
  - Bônus do bônus: peças paradas e vendas por categoria
  - Devoluções descontam da receita e do lucro, no dia em que foram feitas

## Decisões técnicas
- Front-end: HTML, CSS e JavaScript puro
- Backend simples: Node.js guardando dados em arquivos JSON, sem banco de dados
- Dados guardados: lista de **peças** (cada uma com seus tamanhos), lista de **vendas** (cada uma com seus itens) e lista de **usuários**
- Categorias e seus tamanhos: um objeto em que a categoria é a chave e os tamanhos são a lista
- Sem frameworks

## Em aberto
- Como a Marina cadastra os usuários da loja
- O que a venda guarda sobre o preço, para que mudar o valor de uma peça no futuro não altere a receita das vendas antigas
- O que acontece com as caixas marcadas depois que a devolução é confirmada
- O que acontece no modal de cadastro se a categoria for trocada depois de preencher os tamanhos
- Onde fica o checkout no celular
