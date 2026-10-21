const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.post('/api/login', (req, res) => {
    console.log(req.body);
    res.json({ ok: true });
});

app.listen(3000);

