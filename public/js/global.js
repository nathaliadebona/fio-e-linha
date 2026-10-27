const itensMenu = [
    { pagina: 'estoque', href: 'estoque.html', icone: 'fa-boxes-stacked', texto: 'Estoque' },
    { pagina: 'baixa', href: 'baixa.html', icone: 'fa-cart-shopping', texto: 'Baixa' },
    { pagina: 'historico', href: 'historico.html', icone: 'fa-clock-rotate-left', texto: 'Histórico' },
    { pagina: 'usuarios', href: 'usuarios.html', icone: 'fa-users', texto: 'Usuários' }
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

    const liSair = document.createElement('li');

    const botaoSair = document.createElement('button');
    botaoSair.type = 'button';
    botaoSair.id = 'sair-btn';

    const iconeSair = document.createElement('i');
    iconeSair.classList.add('fa-solid', 'fa-right-from-bracket');
    iconeSair.setAttribute('aria-hidden', 'true');

    botaoSair.appendChild(iconeSair);
    botaoSair.append(' Sair');

    liSair.appendChild(botaoSair);
    lista.appendChild(liSair);

    nav.appendChild(lista);
    return nav;
}

const token = localStorage.getItem('token');

async function verificarSessao() {
    const resposta = await fetch('/api/sessao', { headers: { Authorization: token } });
    
    if (!resposta.ok) {
        window.location.href = '/login.html';
    }
}

verificarSessao();

document.body.prepend(montarMenu());

const sairBtn = document.getElementById('sair-btn');

sairBtn.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST', headers: { Authorization: token } });

    localStorage.removeItem('token');
    window.location.href = '/login.html';
});