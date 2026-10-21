const listaPecas = document.getElementById('lista-pecas');

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
    });
}

carregarPecas();