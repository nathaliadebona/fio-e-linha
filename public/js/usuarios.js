const formUsuario = document.getElementById('form-usuario');
const listaUsuarios = document.getElementById('lista-usuarios');
const campoUsuario = document.getElementById('novo-usuario');
const campoSenha = document.getElementById('nova-senha');
const campoConfirmar = document.getElementById('confirmar-senha');
const erroUsuario = document.getElementById('erro-usuario');
const modalRemover = document.getElementById('modal-remover');
const removerTexto = document.getElementById('remover-texto');
const cancelarRemoverBtn = document.getElementById('cancelar-remover');
const confirmarRemoverBtn = document.getElementById('confirmar-remover');

let usuarioLogado = '';
let usuarioRemovendo = '';

async function carregarUsuarios() {
    const sessao = await fetch('/api/sessao', { headers: { Authorization: token } });
    const dadosSessao = await sessao.json();
    usuarioLogado = dadosSessao.usuario;

    const resposta = await fetch('/api/usuarios', { headers: { Authorization: token } });
    const nomes = await resposta.json();

    renderizarUsuarios(nomes);
}

function renderizarUsuarios(nomes) {
    listaUsuarios.replaceChildren();

    nomes.forEach((nome) => {
        const item = document.createElement('li');

        const nomeUsuario = document.createElement('p');
        nomeUsuario.classList.add('nome-usuario');
        nomeUsuario.textContent = nome === usuarioLogado ? `${nome} (você)` : nome;

        item.appendChild(nomeUsuario);

        if (nome !== usuarioLogado) {
            const btnRemover = document.createElement('button');
            btnRemover.type = 'button';
            btnRemover.classList.add('btn-secundario', 'btn-excluir');
            btnRemover.textContent = 'Remover';
            btnRemover.setAttribute('aria-label', `Remover ${nome}`);

            btnRemover.addEventListener('click', () => {
                usuarioRemovendo = nome;
                removerTexto.textContent = `Você vai remover "${nome}". Essa pessoa perde o acesso ao sistema.`;
                modalRemover.showModal();
            });

            item.appendChild(btnRemover);
        }

        listaUsuarios.appendChild(item);
    });
}

formUsuario.addEventListener('submit', async (event) => {
    event.preventDefault();

    erroUsuario.hidden = true;

    if (campoSenha.value.length < 6) {
        erroUsuario.textContent = 'A senha precisa ter pelo menos 6 caracteres';
        erroUsuario.hidden = false;
        return;
    }

    if (campoSenha.value !== campoConfirmar.value) {
        erroUsuario.textContent = 'As senhas não conferem';
        erroUsuario.hidden = false;
        return;
    }

    const resposta = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ usuario: campoUsuario.value, senha: campoSenha.value })
    });

    if (resposta.status === 409) {
        erroUsuario.textContent = 'Esse usuário já existe';
        erroUsuario.hidden = false;
        return;
    }

    if (!resposta.ok) {
        erroUsuario.textContent = 'Não foi possível cadastrar. Confira os dados e tente de novo.';
        erroUsuario.hidden = false;
        return;
    }

    formUsuario.reset();
    await carregarUsuarios();
});

cancelarRemoverBtn.addEventListener('click', () => {
    modalRemover.close();
});

confirmarRemoverBtn.addEventListener('click', async () => {
    await fetch(`/api/usuarios/${encodeURIComponent(usuarioRemovendo)}`, {
        method: 'DELETE',
        headers: { Authorization: token }
    });

    await carregarUsuarios();
    modalRemover.close();
    usuarioRemovendo = '';
});

carregarUsuarios();