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
    
        const usuario = document.createElement('p');
        usuario.classList.add('usuario-venda');
        usuario.textContent = `Registrada por ${venda.usuario}`;

        const data = document.createElement('p');
        data.classList.add('data-venda');
        data.textContent = new Date(venda.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

        listaVendas.appendChild(item);
        item.appendChild(usuario);
        item.appendChild(data);
    });
}

carregarVendas();