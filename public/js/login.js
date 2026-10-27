const formLogin = document.getElementById('login-form');
const campoUsuario = document.getElementById('usuario');
const campoSenha = document.getElementById('senha');
const mensagemErro = document.querySelector('.mensagem-erro');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: campoUsuario.value, senha: campoSenha.value })
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        
        localStorage.setItem('token', dados.token);

        window.location.href = '/estoque.html';
    } else {
        mensagemErro.classList.add('visivel');
    }
});