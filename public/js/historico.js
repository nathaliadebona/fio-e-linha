const listaVendas = document.getElementById('vendas');
const barraDevolucao = document.getElementById('barra-devolucao');
const devolucaoContagem = document.getElementById('devolucao-contagem');
const modalDevolucao = document.getElementById('modal-devolucao');
const listaDevolucao = document.getElementById('lista-devolucao');
const devolverBtn = document.getElementById('devolver-btn');
const cancelarDevolucaoBtn = document.getElementById('cancelar-devolucao');
const formDevolucao = document.getElementById('form-devolucao');
const devolucaoErro = document.getElementById('devolucao-erro');
const filtroDia = document.getElementById('filtro-dia');
const limparFiltroBtn = document.getElementById('limpar-filtro');

let todasAsVendas = [];
let selecionados = [];

async function carregarVendas() {
    const resposta = await fetch('/api/vendas', { headers: { Authorization: token } });
    const vendas = await resposta.json();
    vendas.reverse();

    todasAsVendas = vendas;

    aplicarFiltros();
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

        const listaProdutos = document.createElement('ul');
        listaProdutos.classList.add('itens-venda');

        venda.itens.forEach((produto) => {
            const itemProduto = document.createElement('li');

            const rotulo = document.createElement('label');

            const caixa = document.createElement('input');
            caixa.type = 'checkbox';
            caixa.disabled = produto.devolvida >= produto.quantidade;

            const marcado = { vendaId: venda.id, produto };

            caixa.addEventListener('change', () => {
                if (caixa.checked) {
                    selecionados.push(marcado);
                } else {
                    selecionados = selecionados.filter((outro) => outro !== marcado);
                }

                atualizarBarra();
            });

            rotulo.appendChild(caixa);
            rotulo.append(`${produto.nome} (${produto.codigo}) · ${produto.cor} · ${produto.tamanho} · ${produto.quantidade} un.`);

            itemProduto.appendChild(rotulo);

            if (produto.devolvida > 0) {
                itemProduto.classList.add('devolvido');

                const avisoDevolucao = document.createElement('p');
                avisoDevolucao.classList.add('aviso-devolucao');

                const iconeDevolucao = document.createElement('i');
                iconeDevolucao.classList.add('fa-solid', 'fa-rotate-left');
                iconeDevolucao.setAttribute('aria-hidden', 'true');

                
                avisoDevolucao.appendChild(iconeDevolucao);
                avisoDevolucao.append(` Devolvido: ${produto.devolvida} de ${produto.quantidade}`);

                itemProduto.appendChild(avisoDevolucao);
            }

            listaProdutos.appendChild(itemProduto);
        });

        listaVendas.appendChild(item);
        item.appendChild(usuario);
        item.appendChild(data);
        item.appendChild(listaProdutos);
    });
}

function atualizarBarra() {
    devolucaoContagem.textContent = selecionados.length;

    if (selecionados.length === 0) {
        barraDevolucao.hidden = true;
    } else {
        barraDevolucao.hidden = false;
    }
}

function aplicarFiltros() {
    let filtradas;

    if (filtroDia.value === '') {
        const limite = new Date();
        limite.setDate(limite.getDate() - 7);

        filtradas = todasAsVendas.filter((venda) => new Date(venda.data) >= limite);
    } else {
        const inicio = new Date(`${filtroDia.value}T00:00:00`);

        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 1);

        filtradas = todasAsVendas.filter((venda) => {
            const data = new Date(venda.data);
            return data >= inicio && data < fim;
        });
    }

    renderizarVendas(filtradas);
}

devolverBtn.addEventListener('click', () => {
    listaDevolucao.replaceChildren();

    selecionados.forEach((marcado) => {
        const produto = marcado.produto;
        const podem = produto.quantidade - produto.devolvida;

        const item = document.createElement('li');

        const rotulo = document.createElement('label');
        rotulo.append(`${produto.nome} · ${produto.tamanho} · podem voltar: ${podem}`);

        const campo = document.createElement('input');
        campo.type = 'number';
        campo.min = '1';
        campo.max = podem;
        campo.value = podem;
        campo.required = true;

        rotulo.appendChild(campo);
        item.appendChild(rotulo);
        listaDevolucao.appendChild(item);
    });

    devolucaoErro.hidden = true;
    modalDevolucao.showModal();
});

cancelarDevolucaoBtn.addEventListener('click', () => {
    modalDevolucao.close();
});

formDevolucao.addEventListener('submit', async (event) => {
    event.preventDefault();

    const campos = listaDevolucao.querySelectorAll('input');

    const devolucoes = selecionados.map((marcado, i) => ({
        vendaId: marcado.vendaId,
        codigo: marcado.produto.codigo,
        tamanho: marcado.produto.tamanho,
        quantidade: Number(campos[i].value)
    }));

    const resposta = await fetch('/api/devolucao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ devolucoes })
    });

    if (resposta.ok) {
        selecionados = [];
        modalDevolucao.close();
        await carregarVendas();
        atualizarBarra();
    } else {
        devolucaoErro.textContent = 'Não foi possível devolver: confira as quantidades e tente de novo.';
        devolucaoErro.hidden = false;
    }
});

filtroDia.addEventListener('change', () => {
    aplicarFiltros();
});

limparFiltroBtn.addEventListener('click', () => {
    filtroDia.value = '';
    aplicarFiltros();
});

carregarVendas();