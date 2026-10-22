const express = require('express');
const usuarios = require('./data/usuarios.json');
const pecas = require('./data/pecas.json');
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
    console.log(req.params.id);
    res.json({ ok: true });
});

app.listen(3000);

