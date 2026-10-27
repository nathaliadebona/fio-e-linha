document.querySelectorAll('.toggle-senha').forEach((botao) => {
    const campo = botao.parentElement.querySelector('input');
    const icone = botao.querySelector('i');
    const rotuloMostrar = botao.getAttribute('aria-label');

    botao.addEventListener('click', () => {
        const mostrando = campo.type === 'text';

        campo.type = mostrando ? 'password' : 'text';
        icone.classList.toggle('fa-eye', mostrando);
        icone.classList.toggle('fa-eye-slash', !mostrando);
        botao.setAttribute('aria-label', mostrando ? rotuloMostrar : rotuloMostrar.replace('Mostrar', 'Ocultar'));
    });
});