const listaVendas = document.getElementById('vendas');
const barraDevolucao = document.getElementById('barra-devolucao');
const devolucaoContagem = document.getElementById('devolucao-contagem');

let todasAsVendas = [];
let selecionados = [];

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

        const listaProdutos = document.createElement('ul');
        listaProdutos.classList.add('itens-venda');

        venda.itens.forEach((produto) => {
            const itemProduto = document.createElement('li');

            const rotulo = document.createElement('label');

            const caixa = document.createElement('input');
            caixa.type = 'checkbox';

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

carregarVendas();