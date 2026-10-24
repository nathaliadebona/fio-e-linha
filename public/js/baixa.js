const listaResultados = document.getElementById('resultados');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoBusca = document.getElementById('campo-busca');
const buscaBtn = document.getElementById('busca-btn');

let todasAsPecas = [];

async function carregarPecas() {
    const resposta = await fetch('/api/pecas', { headers: { Authorization: token } });
    const pecas = await resposta.json();

    todasAsPecas = pecas;

    renderizarResultados(pecas);
}

function renderizarResultados(lista) {
    listaResultados.replaceChildren();

    lista.forEach((peca) => {
        const item = document.createElement('li');
        item.textContent = `${peca.nome} (${peca.codigo}) - ${peca.cor}`;
        listaResultados.appendChild(item);
    });
}

carregarPecas();