const itensMenu = [
    { pagina: 'estoque', href: 'estoque.html', icone: 'fa-boxes-stacked', texto: 'Estoque' },
    { pagina: 'baixa', href: 'baixa.html', icone: 'fa-cart-shopping', texto: 'Baixa' },
    { pagina: 'historico', href: 'historico.html', icone: 'fa-clock-rotate-left', texto: 'Histórico' }
];

function montarMenu() {
    const nav = document.createElement('nav');
    const lista = document.createElement('ul');

    itensMenu.forEach((itemMenu) => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.href = itemMenu.href;

        if (itemMenu.pagina === document.body.dataset.pagina) {
            link.setAttribute('aria-current', 'page');
        }

        const icone = document.createElement('i');
        icone.classList.add('fa-solid', itemMenu.icone);
        icone.setAttribute('aria-hidden', 'true');

        link.appendChild(icone);
        link.append(` ${itemMenu.texto}`);

        li.appendChild(link);
        lista.appendChild(li);
    });

    nav.appendChild(lista);
    return nav;
}

console.log(montarMenu().outerHTML);

console.log(montarMenu().outerHTML);

const token = localStorage.getItem('token');

async function verificarSessao() {
    const resposta = await fetch('/api/sessao', { headers: { Authorization: token } });
    
    if (!resposta.ok) {
        window.location.href = '/login.html';
    }
}

verificarSessao();

const sairBtn = document.getElementById('sair-btn');

sairBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
});