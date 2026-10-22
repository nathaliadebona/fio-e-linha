const listaPecas = document.getElementById('lista-pecas');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoBusca = document.getElementById('busca');
const buscaBtn = document.getElementById('busca-btn');
const alertaEstoque = document.querySelector('.alerta-estoque');

const icones = {
    blusa: 'fa-shirt',
    vestido: 'fa-person-dress',
    calca: 'fa-tag',
    acessorio: 'fa-gem'
};

let todasAsPecas = [];

async function carregarPecas() {
    const resposta = await fetch('/api/pecas', { headers: { Authorization: token } });
    const pecas = await resposta.json();

    todasAsPecas = pecas;

    renderizarPecas(pecas);
}

function renderizarPecas(lista) {
    listaPecas.replaceChildren();

    lista.forEach((peca) => {
        const item = document.createElement('li');

        const cabecalho = document.createElement('div');
        cabecalho.classList.add('cabecalho-peca');

        const icone = document.createElement('i');
        icone.classList.add('fa-solid', icones[peca.categoria]);
        icone.setAttribute('aria-hidden', 'true');

        const titulo = document.createElement('p');
        titulo.classList.add('nome-peca');
        titulo.textContent = `${peca.nome} (${peca.codigo})`;
        
        const etiquetas = document.createElement('div');
        etiquetas.classList.add('etiquetas');

        const preco = document.createElement('p');
        preco.classList.add('preco-peca')
        preco.textContent = peca.venda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const acoes = document.createElement('div');
        acoes.classList.add('acoes');

        const btnDetalhes = document.createElement('button');
        btnDetalhes.type = 'button';
        btnDetalhes.classList.add('btn-secundario');
        btnDetalhes.textContent = 'Detalhes';

        const btnEditar = document.createElement('button');
        btnEditar.type = 'button';
        btnEditar.classList.add('btn-secundario');
        btnEditar.textContent = 'Editar';

        const btnExcluir = document.createElement('button');
        btnExcluir.type = 'button';
        btnExcluir.setAttribute('aria-label', 'Excluir peça');
        btnExcluir.classList.add('btn-secundario', 'btn-excluir');
        
        const iconeExcluir = document.createElement('i');
        iconeExcluir.classList.add('fa-solid', 'fa-trash');
        iconeExcluir.setAttribute('aria-hidden', 'true');

        btnExcluir.appendChild(iconeExcluir);

        acoes.appendChild(btnDetalhes);
        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);

        listaPecas.appendChild(item);
        cabecalho.appendChild(icone);
        cabecalho.appendChild(titulo);
        item.appendChild(cabecalho);
        item.appendChild(etiquetas);
        item.appendChild(preco);
        item.appendChild(acoes);

        Object.entries(peca.tamanhos).forEach(([tamanho, quantidade]) => {
            const etiqueta = document.createElement('span');
            etiqueta.classList.add('etiqueta');
            etiqueta.textContent = `${tamanho} ${quantidade}`;
            
            if (quantidade <= 3) {
                etiqueta.classList.add('baixo');
            }

            etiquetas.appendChild(etiqueta);
        });

        const estoqueBaixo = Object.values(peca.tamanhos).some((quantidade) => quantidade <= 3);
        
        if (estoqueBaixo) {
            alertaEstoque.classList.add('visivel');
        }
    });
}

function aplicarFiltros() {
    const texto = campoBusca.value.toLowerCase().trim();

    const filtradas = todasAsPecas.filter((peca) => {
        const passaCategoria = filtroCategoria.value === '' || peca.categoria === filtroCategoria.value;
    
        const passaBusca = peca.nome.toLowerCase().includes(texto) || peca.codigo.toLowerCase().includes(texto);
    
        return passaCategoria && passaBusca;
    });
    renderizarPecas(filtradas);
}

filtroCategoria.addEventListener('change', () => {
    aplicarFiltros();
});

buscaBtn.addEventListener('click', () => {
    aplicarFiltros();
});

carregarPecas();