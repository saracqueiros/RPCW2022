var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')

var User = require('../controllers/user')
var UserSchema = require('../models/user')

/*
router.get('/', function(req, res) {
        User.listar()
            .then(dados => res.status(200).jsonp({ dados: dados }))
            .catch(e => res.status(500).jsonp({ error: e }))
})
*/


router.get('/', function(req, res) {
        if (req.query.username != 'undefined') {
            User.consultarPorUsername(req.query.username)
                .then(dados => { res.status(200).jsonp({ dados: dados }) })
                .catch(e => res.status(500).jsonp({ error: e }))
        } else if (req.query.level != 'undefined') {
            User.consultarPorLevel(req.query.level)
                .then(dados => { res.status(200).jsonp({ dados: dados }) })
                .catch(e => res.status(500).jsonp({ error: e }))
        } else {
            User.listar()
                .then(dados => { res.status(200).jsonp({ dados: dados }) })
                .catch(e => res.status(500).jsonp({ error: e }))
        }

    })
    /*
    router.post('/', function(req, res) {
        User.inserir(req.body)
            .then(dados => res.status(201).jsonp({ dados: dados }))
            .catch(e => res.status(500).jsonp({ error: e }))
    })
    */
router.post('/login', passport.authenticate('local'), function(req, res) {
    jwt.sign({
            username: req.user.username,
            level: req.user.level,
            sub: 'aula de DAW2020'
        },
        "DAW2020", { expiresIn: 3600 },
        function(e, token) {
            if (e) res.status(500).jsonp({ error: "Erro na geração do token: " + e })
            else res.status(201).jsonp({ token: token })
        });
})



router.post('/registar', function(req, res) {
    let user = new UserSchema({
        username: req.body.username,
        password: req.body.password,
        level: "user"
    })
    User.inserir(user)
        .then(dados => res.status(201).jsonp({ dados: dados }))
        .catch(e => res.status(500).jsonp({ error: e }))
})



router.post('/editarPass/:id', function(req, res) {
    User.updatePassword(req.params.id, req.body.password)
        .then(res.status(201).jsonp({}))
        .catch(e => res.status(500).jsonp({ error: e }))
})

router.post('/editarPerm/:id', function(req, res) {
    User.updateLevel(req.params.id, req.body.level)
        .then(res.status(201).jsonp({}))
        .catch(e => res.status(500).jsonp({ error: e }))
})


router.post('/eliminar/:id', function(req, res) {
    User.remover(req.params.id)
        .then(res.status(201).jsonp({}))
        .catch(e => res.status(500).jsonp({ error: e }))
})

router.get('/logout', function(req, res) {
    User.consultar(req.body.username)
        .then(dados => res.status(201).jsonp({ dados: dados }))
        .catch(e => res.status(500).jsonp({ error: e }))
})

module.exports = router;