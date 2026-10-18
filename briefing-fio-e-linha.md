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

## Telas
1. **Login**
2. **Estoque** (cadastro de produtos + controle do estoque)
3. **Baixa** (tela só para vender/devolver, pensada para ser rápida)

## Funcionalidades essenciais (MVP)
- Login de usuários
- Cadastrar peça nova com: nome, cor, tamanho, quantidade, preço de custo, preço de venda, fornecedor, data de chegada, tipo da peça e código (por tipo + cor)
- Listar o estoque
- Dar baixa: filtrar por código, selecionar a peça, informar tamanho e quantidade; poder dar baixa em várias peças de uma vez
- Devolver peça ao estoque (troca/devolução) mantendo o histórico
- Alerta de estoque baixo: **3 peças ou menos por tamanho**

## Bônus (parte 2)
- Peças mais vendidas
- Filtro por tipo de peça
- Limite de alerta diferente por tipo (ex.: acessórios só alertam quando quase zerar)

## Decisões técnicas
- Front-end: HTML, CSS e JavaScript puro
- Backend simples: Node.js guardando dados em arquivo JSON, sem banco de dados
- Sem frameworks

## Em aberto
- Todos os usuários terão o mesmo acesso? (por enquanto: sim)
- Como a devolução será registrada no histórico?
