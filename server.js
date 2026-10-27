const express = require('express');
const usuarios = require('./data/usuarios.json');
const pecas = require('./data/pecas.json');
const vendas = require('./data/vendas.json');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const sessoes = Object.create(null);

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

function gerarHash(senha) {
    const sal = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(senha, sal, 64).toString('hex');

    return `${sal}:${hash}`;
}

function conferirSenha(senha, guardado) {
    const [sal, hash] = guardado.split(':');
    const hashTentativa = crypto.scryptSync(senha, sal, 64).toString('hex');

    return hashTentativa === hash;
}

let precisaSalvar = false;

usuarios.forEach((u) => {
    if (!u.senha.includes(':')) {
        u.senha = gerarHash(u.senha);
        precisaSalvar = true;
    }
});

if (precisaSalvar) {
    fs.writeFileSync('./data/usuarios.json', JSON.stringify(usuarios, null, 2));
}

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.post('/api/login', (req, res) => {
    const usuarioEncontrado = usuarios.find((u) => {
        return u.usuario === req.body.usuario && conferirSenha(req.body.senha, u.senha);
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

    const codigoRepetido = pecas.some((p) => {
        return p.codigo === novaPeca.codigo;
    });

    if (codigoRepetido) {
        return res.status(400).json({ ok: false });
    }

    novaPeca.id = Math.max(0, ...pecas.map((p) => p.id)) + 1;
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

    const codigoRepetido = pecas.some((p) => {
        return p.codigo === req.body.codigo && p.id !== id;
    });

    if (codigoRepetido) {
        return res.status(400).json({ ok: false });
    }

    pecas[indice] = { ...req.body, id };
    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));

    res.json({ ok: true });
});

app.post('/api/baixa', verificarToken, (req, res) => {
    const itens = req.body.itens;
    let temProblema = false;
    const totais = {};

    itens.forEach((item) => {
        const peca = pecas.find((p) => p.codigo === item.codigo);
        const quantidadeInvalida = !Number.isInteger(item.quantidade) || item.quantidade < 1;

        if (!peca || quantidadeInvalida) {
            temProblema = true;
            return;
        }

        const chave = `${item.codigo}|${item.tamanho}`;
        totais[chave] = (totais[chave] || 0) + item.quantidade;

        if (totais[chave] > (peca.tamanhos[item.tamanho] || 0)) {
            temProblema = true;
        }
    });

    if (temProblema) {
        return res.status(400).json({ ok: false });
    }

    const novaVenda = {
        id: vendas.length + 1,
        usuario: sessoes[req.headers.authorization],
        data: new Date().toISOString(),
        itens: []
    };

    itens.forEach((item) => {
        const peca = pecas.find((p) => p.codigo === item.codigo);
        peca.tamanhos[item.tamanho] -= item.quantidade;
        novaVenda.itens.push({
            codigo: peca.codigo,
            nome: peca.nome,
            cor: peca.cor,
            categoria: peca.categoria,
            preco: peca.venda,
            tamanho: item.tamanho,
            quantidade: item.quantidade,
            devolvida: 0
        });
    });

    vendas.push(novaVenda);

    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));
    fs.writeFileSync('./data/vendas.json', JSON.stringify(vendas, null, 2));

    res.json({ ok: true });
});

app.get('/api/vendas', verificarToken, (req, res) => {
    res.json(vendas);
});

app.post('/api/devolucao', verificarToken, (req, res) => {
    const devolucoes = req.body.devolucoes;
    let temProblema = false;
    const totais = {};

    devolucoes.forEach((d) => {
        const venda = vendas.find((v) => v.id === d.vendaId);

        const produto = venda
            ? venda.itens.find((item) => item.codigo === d.codigo && item.tamanho === d.tamanho)
            : undefined;

        const quantidadeInvalida = !Number.isInteger(d.quantidade) || d.quantidade < 1;

        if (!venda || !produto || quantidadeInvalida) {
            temProblema = true;
            return;
        }

        const chave = `${d.vendaId}|${d.codigo}|${d.tamanho}`;
        totais[chave] = (totais[chave] || 0) + d.quantidade;

        if (totais[chave] > produto.quantidade - produto.devolvida) {
            temProblema = true;
        }
    });

    if (temProblema) {
        return res.status(400).json({ ok: false });
    }

    devolucoes.forEach((d) => {
        const venda = vendas.find((v) => v.id === d.vendaId);
        const produto = venda.itens.find((item) => item.codigo === d.codigo && item.tamanho === d.tamanho);

        produto.devolvida += d.quantidade;

        produto.devolucoes = produto.devolucoes || [];

        produto.devolucoes.push({
            quantidade: d.quantidade,
            usuario: sessoes[req.headers.authorization],
            data: new Date().toISOString()
        });

        const peca = pecas.find((p) => p.codigo === d.codigo);

        if (peca) {
            peca.tamanhos[d.tamanho] = (peca.tamanhos[d.tamanho] || 0) + d.quantidade;
        }
    });

    fs.writeFileSync('./data/pecas.json', JSON.stringify(pecas, null, 2));
    fs.writeFileSync('./data/vendas.json', JSON.stringify(vendas, null, 2));

    res.json({ ok: true });
});

app.post('/api/logout', verificarToken, (req, res) => {
    const token = req.headers.authorization;

    delete sessoes[token];

    res.json({ ok: true });
});

app.get('/api/usuarios', verificarToken, (req, res) => {
    res.json(usuarios.map((u) => u.usuario));
});

app.post('/api/usuarios', verificarToken, (req, res) => {
    const { usuario, senha } = req.body;

    if (typeof usuario !== 'string' || typeof senha !== 'string' || usuario.trim() === '' || senha.length < 6) {
        return res.status(400).json({ ok: false });
    }

    const nome = usuario.trim();

    const jaExiste = usuarios.some((u) => {
        return u.usuario.toLowerCase() === nome.toLowerCase();
    });

    if (jaExiste) {
        return res.status(409).json({ ok: false });
    }

    usuarios.push({ usuario: nome, senha: gerarHash(senha) });

    fs.writeFileSync('./data/usuarios.json', JSON.stringify(usuarios, null, 2));

    res.json({ ok: true });
});

app.delete('/api/usuarios/:usuario', verificarToken, (req, res) => {
    const nome = req.params.usuario;
    const indice = usuarios.findIndex((u) => u.usuario === nome);

    if (indice === -1) {
        return res.status(404).json({ ok: false });
    }

    if (sessoes[req.headers.authorization] === nome) {
        return res.status(403).json({ ok: false });
    }

    usuarios.splice(indice, 1);

    fs.writeFileSync('./data/usuarios.json', JSON.stringify(usuarios, null, 2));

    Object.keys(sessoes).forEach((token) => {
        if (sessoes[token] === nome) {
            delete sessoes[token];
        }
    });

    res.json({ ok: true });
});

app.listen(3000);