const listaPecas = document.getElementById('lista-pecas');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoBusca = document.getElementById('busca');
const buscaBtn = document.getElementById('busca-btn');
const novaPecaBtn = document.getElementById('nova-peca-btn');
const modalPeca = document.getElementById('modal-peca');
const fecharModalBtn = document.getElementById('fechar-modal');
const formPeca = document.getElementById('form-peca');
const categoriaSelect = document.getElementById('categoria');
const listaTamanhos = document.getElementById('lista-tamanhos');
const dataChegada = document.getElementById('data-chegada');
const erroTamanhos = document.getElementById('erro-tamanhos');

const alertaEstoque = document.querySelector('.alerta-estoque');

const icones = {
    blusa: 'fa-shirt',
    vestido: 'fa-person-dress',
    calca: 'fa-tag',
    acessorio: 'fa-gem'
};

const tamanhosPorCategoria = {
    blusa: ['P', 'M', 'G', 'GG'],
    vestido: ['P', 'M', 'G', 'GG'],
    calca: ['36', '38', '40', '42', '44'],
    acessorio: ['Único']
};

let todasAsPecas = [];
let pecaEditandoId = null;

async function carregarPecas() {
    const resposta = await fetch('/api/pecas', { headers: { Authorization: token } });
    const pecas = await resposta.json();

    todasAsPecas = pecas;

    atualizarAlerta();
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

        btnEditar.addEventListener('click', () => {
            pecaEditandoId = peca.id;

            document.querySelector('#modal-peca h2').textContent = 'Editar peça';
            
            nome.value = peca.nome;
            cor.value = peca.cor;
            codigo.value = peca.codigo;
            custo.value = peca.custo;
            venda.value = peca.venda;
            fornecedor.value = peca.fornecedor;
            dataChegada.value = peca.dataChegada;
            categoriaSelect.value = peca.categoria;

            categoriaSelect.dispatchEvent(new Event('change'));

            const rotulos = listaTamanhos.querySelectorAll('label');
            rotulos.forEach((rotulo) => {
                const caixa = rotulo.querySelector('input[type="checkbox"]');
                const campoQtd = rotulo.querySelector('input[type="number"]');

                if (peca.tamanhos[caixa.value] !== undefined) {
                    caixa.checked = true;
                    caixa.dispatchEvent(new Event('change'));
                    campoQtd.value = peca.tamanhos[caixa.value];
                }
            });

            modalPeca.showModal();
        });

        const btnExcluir = document.createElement('button');
        btnExcluir.type = 'button';
        btnExcluir.setAttribute('aria-label', 'Excluir peça');
        btnExcluir.classList.add('btn-secundario', 'btn-excluir');
        
        const iconeExcluir = document.createElement('i');
        iconeExcluir.classList.add('fa-solid', 'fa-trash');
        iconeExcluir.setAttribute('aria-hidden', 'true');

        btnExcluir.addEventListener('click', async () => {
            const confirmou = confirm(`Excluir ${peca.nome}?`);
            
            if (!confirmou) {
                return;
            }

            await fetch(`/api/pecas/${peca.id}`, {
                method: 'DELETE',
                headers: { Authorization: token }
            });

            await carregarPecas();
        });

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

function atualizarAlerta() {
    const algumBaixo = todasAsPecas.some((peca) => {
        return Object.values(peca.tamanhos).some((quantidade) => quantidade <= 3);
    });

    if (algumBaixo) {
        alertaEstoque.classList.add('visivel');
    } else {
        alertaEstoque.classList.remove('visivel');
    }
}

filtroCategoria.addEventListener('change', () => {
    aplicarFiltros();
});

buscaBtn.addEventListener('click', () => {
    aplicarFiltros();
});

novaPecaBtn.addEventListener('click', () => {
    erroTamanhos.hidden = true;

    pecaEditandoId = null;
    document.querySelector('#modal-peca h2').textContent = 'Nova peça';
    formPeca.reset();
    listaTamanhos.replaceChildren();

    modalPeca.showModal();
});

fecharModalBtn.addEventListener('click', () => {
    modalPeca.close();
});

categoriaSelect.addEventListener('change', () => {
    const tamanhos = tamanhosPorCategoria[categoriaSelect.value] || [];
    listaTamanhos.replaceChildren();

    tamanhos.forEach((tamanho) => {
        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = tamanho;

        input.addEventListener('change', () => {
            quantidade.hidden = !input.checked;
            erroTamanhos.hidden = true;
            quantidade.required = input.checked;
        });

        const quantidade = document.createElement('input');
        quantidade.type = 'number';
        quantidade.min = '1';
        quantidade.hidden = true;
        quantidade.setAttribute('aria-label', `Quantidade do tamanho ${tamanho}`);

        label.appendChild(input);
        label.append(tamanho);
        label.appendChild(quantidade);
        listaTamanhos.appendChild(label);
    });
});

formPeca.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const tamanhos = {};
    const rotulos = listaTamanhos.querySelectorAll('label');

    rotulos.forEach((rotulo) => {
        const caixa = rotulo.querySelector('input[type="checkbox"]');
        const campoQtd = rotulo.querySelector('input[type="number"]');

        if (caixa.checked) {
            tamanhos[caixa.value] = Number(campoQtd.value);
        }
    });

    if (Object.keys(tamanhos).length === 0) {
        erroTamanhos.hidden = false;
        erroTamanhos.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const novaPeca = {
        categoria: categoria.value,
        nome: nome.value,
        cor: cor.value,
        codigo: codigo.value,
        custo: Number(custo.value),
        venda: Number(venda.value),
        fornecedor: fornecedor.value,
        dataChegada: dataChegada.value,
        tamanhos
    };

    const editando = pecaEditandoId !== null;
    const url = editando ? `/api/pecas/${pecaEditandoId}` : '/api/pecas';
    const metodo = editando ? 'PUT' : 'POST';

    await fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json', 
            Authorization: token
        },
        body: JSON.stringify(novaPeca)
    });

    await carregarPecas();
    modalPeca.close();
    formPeca.reset();
});

carregarPecas();