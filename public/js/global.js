const token = localStorage.getItem('token');

async function verificarSessao() {
    const resposta = await fetch('/api/sessao', { headers: { Authorization: token } });
    
    if (!resposta.ok) {
        window.location.href = '/login.html';
    }
}

verificarSessao();