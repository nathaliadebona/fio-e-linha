const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.listen(3000);

