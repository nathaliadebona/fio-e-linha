const listaVendas = document.getElementById('vendas');

let todasAsVendas = [];

async function carregarVendas() {
    const resposta = await fetch('/api/vendas', { headers: { Authorization: token } });
    const vendas = await resposta.json();

    todasAsVendas = vendas;

    renderizarVendas(vendas);
}

function renderizarVendas(lista) {
    listaVendas.replaceChildren();

    lista.forEach((venda) => {
        const item = document.createElement('li');
        item.textContent = `Venda ${venda.id} - ${venda.usuario}`;
        listaVendas.appendChild(item);
    });
}

carregarVendas();