const listaResultados = document.getElementById('resultados');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoBusca = document.getElementById('busca');
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

function aplicarFiltros() {
    const texto = campoBusca.value.toLowerCase().trim();

    const filtradas = todasAsPecas.filter((peca) => {
        const passaCategoria = filtroCategoria.value === '' || peca.categoria === filtroCategoria.value;
        const passaBusca = peca.nome.toLowerCase().includes(texto) || peca.codigo.toLowerCase().includes(texto);

        return passaCategoria && passaBusca;
    });

    renderizarResultados(filtradas);
}

filtroCategoria.addEventListener('change', () => {
    aplicarFiltros();
});

buscaBtn.addEventListener('click', () => {
    aplicarFiltros();
});

carregarPecas();