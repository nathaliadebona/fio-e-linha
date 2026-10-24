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

        const nomePeca = document.createElement('p');
        nomePeca.classList.add('nome-peca');
        nomePeca.textContent = `${peca.nome} (${peca.codigo})`;

        const corPeca = document.createElement('p');
        corPeca.classList.add('cor-peca');
        corPeca.textContent = peca.cor;

        const etiquetas = document.createElement('div');
        etiquetas.classList.add('etiquetas');

        Object.entries(peca.tamanhos).forEach(([tamanho, quantidade]) => {
            const etiqueta = document.createElement('span');
            etiqueta.classList.add('etiqueta');
            etiqueta.textContent = `${tamanho} ${quantidade}`;

            if (quantidade === 0) {
                etiqueta.classList.add('zerado');
            }

            etiquetas.appendChild(etiqueta);
        });

        listaResultados.appendChild(item);
        item.appendChild(nomePeca);
        item.appendChild(corPeca);
        item.appendChild(etiquetas);
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