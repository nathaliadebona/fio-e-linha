const listaResultados = document.getElementById('resultados');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoBusca = document.getElementById('busca');
const buscaBtn = document.getElementById('busca-btn');
const modalItem = document.getElementById('modal-item');
const itemTitulo = document.getElementById('item-titulo');
const cancelarItemBtn = document.getElementById('cancelar-item');
const itemTamanho = document.getElementById('item-tamanho');
const formItem = document.getElementById('form-item');
const itemQuantidade = document.getElementById('item-quantidade');
const itemErro = document.getElementById('item-erro');

let todasAsPecas = [];
let checkboxAtual = null;
let pecaAtual = null;

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

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('aria-label', `Selecionar ${peca.nome}`);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                itemTitulo.textContent = peca.nome;
                
                checkboxAtual = checkbox;

                itemTamanho.replaceChildren();

                Object.entries(peca.tamanhos).forEach(([tamanho, quantidade]) => {
                    const opcao = document.createElement('option');
                    opcao.value = tamanho;
                    opcao.textContent = `${tamanho} (${quantidade} em estoque)`;
                    opcao.disabled = quantidade === 0;
                    itemTamanho.appendChild(opcao);
                });

                pecaAtual = peca;

                itemErro.hidden = true;

                itemQuantidade.value = '';

                modalItem.showModal();
            }
        });

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
        item.appendChild(checkbox);
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

cancelarItemBtn.addEventListener('click', () => {
    modalItem.close();
});

modalItem.addEventListener('close', () => {
    if (checkboxAtual) {
        checkboxAtual.checked = false;
        checkboxAtual = null;
    }
});

formItem.addEventListener('submit', (event) => {
    event.preventDefault();

    const tamanho = itemTamanho.value;
    const quantidade = Number(itemQuantidade.value);
    const disponivel = pecaAtual.tamanhos[tamanho];

    if (quantidade > disponivel) {
        itemErro.textContent = `Há apenas ${disponivel} em estoque`
        itemErro.hidden = false;
        return;
    }

    console.log(pecaAtual.nome, tamanho, quantidade);
});

carregarPecas();