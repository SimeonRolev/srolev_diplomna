const express = require('express');
const { translations, contexts } = require('./database');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', function (req, res) {
    res.send('Express server')
})

// Translations
app.get('/translations', function (req, res) {
    translations.getAll()
        .then(data => res.send(data))
        .catch(err => res.send(err))
})
app.get('/translations/:id', function (req, res) {
    translations.get(req.params.id)
        .then(data => res.send(data))
        .catch(err => res.send(err)) 
})
app.post('/translations', function (req, res) {
    translations.create(req.body)
        .then(data => res.send(data))
        .catch(err => res.send(err))
})
app.put('/translations/:id', function (req, res) {
    translations.update(req.params.id, req.body)
        .then(data => {
            return res.send(data)
        })
        .catch(err => {
            return res.send(err)
        })
})

//Contexts
app.get('/contexts/:id', function (req, res) {
    contexts.get(req.params.id)
        .then(data => res.send(data))
        .catch(err => res.send(err))
})
app.post('/contexts', function (req, res) {
    contexts.create(req.body)
        .then(data => res.send(data))
        .catch(err => res.send(err))
})

var server = app.listen(5000, function () {
    console.log('Server is running at http://localhost:' + server.address().port)
});
