// Roteador do servidor API para o problema da gestão de tarefas
var express = require('express');
var router = express.Router();
const Recurso = require('../controllers/recurso')
var RecursoModel = require('../models/recurso')
var fs = require('fs')

// Consultar um Recurso por Id
router.get('/recurso/:id', function(req, res) {
    Recurso.consultarPorId(req.params.id)
        .then(dados => res.status(200).jsonp([dados, req.level]))
        .catch(e => res.status(500).jsonp({ error: e }))
});

// Consultar um Recurso por Id
router.post('/recursos/:id', function(req, res) {
    Recurso.update(req.params.id, req.body.desc, req.body.produtor, req.body.criacao, req.body.submissao)
        .then(dados => res.status(200).jsonp([dados, req.level]))
        .catch(e => res.status(500).jsonp({ error: e }))
});

// Eliminar um Recurso por Id
router.delete('/recursos/eliminar/:id', function(req, res) {
    Recurso.remover(req.params.id)
        .then(res.status(200).jsonp())
        .catch(e => res.status(500).jsonp({ error: e }))
});


router.post('/recursos/comentar/:id', function(req, res) {
    Recurso.comentar(req.params.id, req.body.com, req.user, req.body.aval)
        .then(dados => res.status(200).jsonp(dados.length))
        .catch(e => res.status(500).jsonp({ error: e }))
});



// Número de Recursos na BD
router.get('/recursos/numero', function(req, res) {
    Recurso.listar()
        .then(dados => res.status(200).jsonp(dados.length))
        .catch(e => res.status(500).jsonp({ error: e }))
});

router.get('/recursos/transferir/:user/:id', function(req, res, next) {
    res.download(__dirname + '/../uploads/' + res.params.user + "/" + res.params.id)
})

// Inserir um Recurso
router.post('/recursos', function(req, res) {
    console.log("estou no posto", JSON.parse(req.query.cont))
    files = JSON.parse(req.query.cont)
    user = req.user

    let data = new Date();
    let date = data.getDate() + "-" + (data.getMonth() + 1) + "-" + data.getFullYear()
    for (let i = 0; i < files.length; i++) {
        console.log(files[i])
        let recursoSchema = new RecursoModel({
            _id: files[i].info.filename,
            submissao: date,
            submissor: user,
            titulo: files[i].info.originalname,
            tipo: files[i].info.mimetype,
            desc: files[i].descricao,
            size: files[i].info.size,
            path: 'uploads/' + user + '/' + files[i].info.originalname
        })

        let oldPath = '../app-server/' + files[i].info.path
        let newPath = 'uploads/' + user + '/' + files[i].info.originalname
        console.log("diretoria antiga" + oldPath)
        if (!fs.existsSync('uploads/' + user)) {
            fs.mkdirSync('uploads/' + user);
        }

        fs.rename(oldPath, newPath, function(err) {
            if (err) res.status(500).jsonp()
        })
        Recurso.inserir(recursoSchema)
    }
    //Recurso.inserir(recursoSchema)
    return res.status(201).jsonp()

})


// Alterar um Recurso
router.get('/recursos', function(req, res) {
    if (req.query.titulo != 'undefined') {
        Recurso.consultarPorTitulo(req.query.titulo)
            .then(dados => { res.status(200).jsonp([dados, req.level]) })
            .catch(e => res.status(500).jsonp({ error: e }))
    } else if (req.query.tipo != 'undefined') {
        Recurso.consultarPorTipo(req.query.tipo)
            .then(dados => { res.status(200).jsonp([dados, req.level]) })
            .catch(e => res.status(500).jsonp({ error: e }))
    } else {
        Recurso.listar()
            .then(dados => { res.status(200).jsonp([dados, req.level]) })
            .catch(e => res.status(500).jsonp({ error: e }))
    }




});

//Verificações do nível de acesso do utilizador: n - nivel de acesso do utilizador corrente

module.exports = router;