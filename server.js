const express = require('express');
const usuarios = require('./data/usuarios.json');
const app = express();

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.post('/api/login', (req, res) => {
    const usuarioEncontrado = usuarios.find((u) => {
        return u.usuario === req.body.usuario && u.senha === req.body.senha;
    });
    
    if (usuarioEncontrado) {
        res.json({ ok: true });
    } else {
        res.status(401).json({ ok: false });
    }
});

app.listen(3000);

