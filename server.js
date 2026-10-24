const express = require('express');
const usuarios = require('./data/usuarios.json');
const pecas = require('./data/pecas.json');
const vendas = require('./data/vendas.json');
const fs = require('fs');
const app = express();
const sessoes = {};

app.use(express.json());

app.use(express.static('public'));

function verificarToken(req, res, next) {
    const token = req.headers.authorization;

    if (sessoes[token]) {
        next();
    } else {
        res.status(401).json({ ok: false });
    }
}

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.post('/api/login', (req, res) => {
    const usuarioEncontrado = usuarios.find((u) => {
        return u.usuario === req.body.usuario && u.senha === req.body.senha;
    });
    
    if (usuarioEncontrado) {
        const token = crypto.randomUUID();
        sessoes[token] = usuarioEncontrado.usuario;

        res.json({ ok: true, token: token });
    } else {
        res.status(401).json({ ok: false });
    }
});

app.get('/api/sessao', (req, res) => {
    const token = req.headers.authorization;

    if (sessoes[token]) {
        res.json({ ok: true, usuario: sessoes[token] });
    } else {
        res.status(401).json({ ok: false });
    }
});

app.get('/api/pecas', verificarToken, (req, res) => {
    res.json(pecas);
});

app.post('/api/pecas', verificarToken, (req, res) => {
    const novaPeca = req.body;
    novaPeca.id = Math.max(...pecas.map((p) => p.id)) + 1;
    pecas.push(novaPeca);

    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));

    res.json({ ok: true });
});

app.delete('/api/pecas/:id', verificarToken, (req, res) => {
    const id = Number(req.params.id);
    const indice = pecas.findIndex((p) => p.id === id);

    if (indice === -1) {
        return res.status(404).json({ ok: false });
    }
    pecas.splice(indice, 1);
    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));

    res.json({ ok: true });
});

app.put('/api/pecas/:id', verificarToken, (req, res) => {
    const id = Number(req.params.id);
    const indice = pecas.findIndex((p) => p.id === id);

    if (indice === -1) {
        return res.status(404).json({ ok: false });
    }

    pecas[indice] = { ...req.body, id };
    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));

    res.json({ ok: true });
});

app.post('/api/baixa', verificarToken, (req, res) => {
    const itens = req.body.itens;
    let temProblema = false;

    itens.forEach((item) => {
        const peca = pecas.find((p) => p.codigo === item.codigo);

        if (!peca || item.quantidade > (peca.tamanhos[item.tamanho] || 0)) {
            temProblema = true;
        }
    });

    if (temProblema) {
        return res.status(400).json({ ok: false });
    }

    itens.forEach((item) => {
        const peca = pecas.find((p) => p.codigo === item.codigo);
        peca.tamanhos[item.tamanho] -= item.quantidade;
    });

    const novaVenda = {
        id: vendas.length + 1,
        usuario: sessoes[req.headers.authorization],
        data: new Date().toISOString(),
        itens: []
    };

    vendas.push(novaVenda);

    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));
    fs.writeFileSync('./data/vendas.json', JSON.stringify(vendas, null, 2));

    res.json({ ok: true });
});

app.listen(3000);

