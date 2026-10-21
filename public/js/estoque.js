const listaPecas = document.getElementById('lista-pecas');

async function carregarPecas() {
    const resposta = await fetch('/api/pecas', { headers: { Authorization: token } });
    const pecas = await resposta.json();
    console.log(pecas);
}

carregarPecas();