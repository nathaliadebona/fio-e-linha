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

## Quem usa
- Mais de uma pessoa trabalha na loja, então precisa de **login**
- Todos os usuários têm o mesmo acesso

## Telas
1. **Login**
2. **Estoque** (cadastro de produtos + controle do estoque)
3. **Baixa** (vender várias peças de uma vez, com checkout)
4. **Histórico de vendas** (consulta e devolução)

---

## Tela: Estoque

**Formulário de cadastro**
- Nome da peça, cor, categoria, código (por tipo + cor)
- Quantidade de **cada tamanho** no mesmo cadastro (a peça é cadastrada uma vez só)
- Preço de custo, valor de venda, fornecedor, data de chegada
- Imagem do produto fica fora do essencial (bônus)

**Lista de produtos**
- Ícone da categoria (blusa, vestido, calça...)
- Nome com código
- Etiquetas (badges) de tamanho com quantidade, ex.: P 2 · M 1 · G 3
- Valor de venda
- Botões: detalhes, editar, excluir

**Avisos e proteções**
- Faixa no topo: "Você tem produtos com baixa quantidade em estoque", com botão que leva à lista
- Etiqueta de tamanho em terracota quando houver **3 peças ou menos**
- Excluir sempre pede confirmação

---

## Tela: Baixa

**Busca e seleção**
- Busca por código
- Resultado mostra: nome, código, cor, valor de venda e tamanhos com quantidade disponível
- Caixa de seleção em cada peça; ao marcar, abre um **modal** para escolher o tamanho e a quantidade

**Checkout**
- Lista das peças selecionadas com todas as informações
- Editar quantidade, excluir item
- Botão de dar baixa no final

**Mensagens**
- "Há apenas __ em estoque"
- "Selecione pelo menos um produto para dar baixa"
- "Código inexistente"
- "Baixa efetuada com sucesso"
- O alerta de estoque baixo **não** aparece aqui, para não confundir com a mensagem de sucesso

---

## Tela: Histórico de vendas

**Cards**
- Um card por venda, com: data e hora, quem registrou a baixa, e os produtos (nome, código, tamanho, cor, quantidade vendida)
- Filtros: por dia, categoria etc.
- Caixa de seleção em cada produto do card; ao marcar, libera o botão de **registrar troca/devolução**
- Não existe botão de editar venda: correções são feitas pela devolução

**Devolução**
- Abre um modal com as informações dos produtos e a quantidade a devolver
- A seleção de quantidade **trava** no máximo vendido, então não dá para devolver a mais
- O card **continua** no histórico, com a informação de peça devolvida e a linha do produto em outra cor
- Mensagem: "Produto devolvido ao estoque"

---

## Funcionalidades essenciais (MVP)
- Login de usuários
- Cadastro de peças com vários tamanhos
- Lista de estoque com alerta de estoque baixo (3 peças ou menos por tamanho)
- Baixa de várias peças de uma vez, com checkout
- Histórico de vendas
- Devolução registrada no histórico

## Bônus (parte 2)
- Imagem real do produto, no lugar do ícone
- Peças mais vendidas
- Filtro por tipo de peça na lista de estoque
- Limite de alerta diferente por tipo (ex.: acessórios só alertam quando quase zerar)

## Decisões técnicas
- Front-end: HTML, CSS e JavaScript puro
- Backend simples: Node.js guardando dados em arquivos JSON, sem banco de dados
- Dados guardados: lista de **peças** (cada uma com uma lista de tamanhos), lista de **vendas** (cada uma com seus itens) e lista de **usuários**
- Sem frameworks

## Em aberto
- Como registrar uma devolução parcial no card (ex.: levou 3, devolveu 1)
- Como a Marina cadastra os usuários da loja
