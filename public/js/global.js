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