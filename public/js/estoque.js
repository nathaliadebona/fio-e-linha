const listaPecas = document.getElementById('lista-pecas');
const alertaEstoque = document.querySelector('.alerta-estoque');

async function carregarPecas() {
    const resposta = await fetch('/api/pecas', { headers: { Authorization: token } });
    const pecas = await resposta.json();
    
    pecas.forEach((peca) => {
        const tamanhos = Object.entries(peca.tamanhos)
            .map(([tamanho, quantidade]) => `${tamanho} ${quantidade}`)
            .join(' · ');

        const item = document.createElement('li');
        item.textContent = `${peca.nome} (${peca.codigo}) - ${tamanhos}`;
        listaPecas.appendChild(item);

        const estoqueBaixo = Object.values(peca.tamanhos).some((quantidade) => quantidade <= 3);
        
        if (estoqueBaixo) {
            alertaEstoque.classList.add('visivel');
        }
    });
}

carregarPecas();