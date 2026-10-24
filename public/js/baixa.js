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
const checkoutLista = document.getElementById('checkout-lista');
const checkoutItens = document.getElementById('checkout-itens');
const checkoutTotal = document.getElementById('checkout-total');
const darBaixaBtn = document.getElementById('dar-baixa-btn');
const checkoutErro = document.getElementById('checkout-erro');
const checkoutSucesso = document.getElementById('checkout-sucesso');
const checkoutFalha = document.getElementById('checkout-falha');
const checkoutContador = document.getElementById('checkout-contador');

let todasAsPecas = [];
let checkboxAtual = null;
let pecaAtual = null;
let checkout = [];

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

        const preco = document.createElement('p');
        preco.classList.add('preco-peca');
        preco.textContent = peca.venda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const cabecalho = document.createElement('div');
        cabecalho.classList.add('cabecalho-resultado');

        cabecalho.appendChild(checkbox);
        cabecalho.appendChild(nomePeca);

        listaResultados.appendChild(item);
        item.appendChild(cabecalho);
        item.appendChild(corPeca);
        item.appendChild(preco);
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

function renderizarCheckout() {
    checkoutErro.hidden = true;
    checkoutSucesso.hidden = true;
    checkoutFalha.hidden = true;

    checkoutLista.replaceChildren();

    checkout.forEach((linha) => {
        const item = document.createElement('li');

        const textoLinha = document.createElement('div');
        textoLinha.classList.add('texto-linha');

        const nomeLinha = document.createElement('p');
        nomeLinha.classList.add('nome-linha');
        nomeLinha.textContent = `${linha.nome} (${linha.codigo})`;

        const detalheLinha = document.createElement('p');
        detalheLinha.classList.add('detalhe-linha');
        detalheLinha.textContent = `Tamanho ${linha.tamanho} · ${linha.quantidade} un.`;

        textoLinha.appendChild(nomeLinha);
        textoLinha.appendChild(detalheLinha);

        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.setAttribute('aria-label', `Remover ${linha.nome}, tamanho ${linha.tamanho}`);

        const iconeRemover = document.createElement('i');
        iconeRemover.classList.add('fa-solid', 'fa-trash');
        iconeRemover.setAttribute('aria-hidden', 'true');

        btnRemover.appendChild(iconeRemover);

        btnRemover.addEventListener('click', () => {
            checkout = checkout.filter((outra) => outra !== linha);
            renderizarCheckout();
        });

        item.appendChild(textoLinha);
        item.appendChild(btnRemover);
        checkoutLista.appendChild(item);
    });

    const totalItens = checkout.reduce((soma, linha) => soma + linha.quantidade, 0);
    checkoutItens.textContent = totalItens;
    checkoutContador.textContent = totalItens;

    const total = checkout.reduce((soma, linha) => soma + linha.preco * linha.quantidade, 0);
    checkoutTotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

    const existente = checkout.find((linha) => {
        return linha.codigo === pecaAtual.codigo && linha.tamanho === tamanho;
    });

    const jaNoCheckout = existente ? existente.quantidade : 0;

    if (jaNoCheckout + quantidade > disponivel) {
        itemErro.textContent = `Há apenas ${disponivel} em estoque`;
        itemErro.hidden = false;
        return;
    }

    if (existente) {
        existente.quantidade += quantidade;
    } else {
        checkout.push({
            codigo: pecaAtual.codigo,
            nome: pecaAtual.nome,
            tamanho,
            quantidade,
            preco: pecaAtual.venda
        });
    }

    renderizarCheckout();

    modalItem.close();
});

darBaixaBtn.addEventListener('click', async () => {
    if (checkout.length === 0) {
        checkoutErro.hidden = false;
        return;
    }

    const resposta = await fetch('/api/baixa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ itens: checkout })
    });

    if (resposta.ok) {
        checkout = [];
        renderizarCheckout();
        checkoutSucesso.hidden = false;
        await carregarPecas();
    } else {
        checkoutFalha.hidden = false;
        await carregarPecas();
    }
});

carregarPecas();