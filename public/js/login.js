const formLogin = document.getElementById('login-form');
const campoUsuario = document.getElementById('usuario');
const campoSenha = document.getElementById('senha');
const olhoBtn = document.querySelector('.toggle-senha');
const icone = document.querySelector('.toggle-senha i');

olhoBtn.addEventListener('click', () => {
    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
        icone.classList.replace('fa-eye', 'fa-eye-slash');
        olhoBtn.setAttribute('aria-label', 'Ocultar senha');
    } else {
        campoSenha.type = 'password';
        icone.classList.replace('fa-eye-slash', 'fa-eye');
        olhoBtn.setAttribute('aria-label', 'Mostrar senha');
    }
});

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: campoUsuario.value, senha: campoSenha.value })
    });
});