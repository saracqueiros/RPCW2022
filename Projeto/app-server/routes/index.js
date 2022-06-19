var express = require('express');
var router = express.Router();
var axios = require('axios')
const fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var login = false

router.get('/', function(req, res) {
    res.render('index', { log: login })
});

router.get('/api/', function(req, res) {
    res.render('index', { log: login })
});

router.get('/api/recurso/alterarInfo/:id', function(req, res) {
    res.render('alterInfo-form', { id: req.params.id })
});

router.post('/api/recursos/:id', function(req, res) {
    axios.post('http://localhost:8001/recursos/' + req.params.id + '?token=' + req.cookies.token, req.body)
        .then(
            res.redirect('/api/recursos' + '?token=' + req.cookies.token)
        )
        .catch(e => res.render('error-user', { error: "Comentários falharam!" }))
});


router.get('/login', function(req, res) {
    res.render('login-form');
});

router.get('/registar', function(req, res) {
    res.render('registar');
});

router.post('/registar', function(req, res) {
    axios.post('http://localhost:8002/users/registar', req.body)
        .then(dados => {
            res.cookie('token', dados.data.token, {
                expires: new Date(Date.now() + '1d'),
                secure: false, // set to true if your using https
                httpOnly: true
            });
            res.redirect('/login')
        })
        .catch(e => res.render('error-user', { error: e }))

});


router.post('/api/recursos/comentar/:id', function(req, res) {
    axios.post('http://localhost:8001/recursos/comentar/' + req.params.id + '?token=' + req.cookies.token, req.body)
        .then(dados => {
            res.redirect('/api/recurso/' + req.params.id)
        })
        .catch(e => res.render('error-user', { error: "Comentários falharam!" }))
});




router.post('/login', function(req, res) {
    axios.post('http://localhost:8002/users/login', req.body)
        .then(dados => {
            res.cookie('token', dados.data.token, {
                expires: new Date(Date.now() + '1d'),
                secure: false, // set to true if your using https
                httpOnly: true
            });
            login = true
            res.redirect('/api/recursos')
        })
        .catch(e => res.render('error-user', { error: "As suas credenciais falharam!" }))
});

router.get('/logout', function(req, res) {
    axios.get('http://localhost:8002/users/logout')
        .then(dados => {
            res.cookie('token', dados.data.token, {
                expires: new Date(Date.now())
            });
            login = false
            res.render('logout')  
        })

    .catch(e => res.render('error', { error: e }))
});
/*
router.get('/tarefas', function(req, res) {
    console.log(JSON.stringify(req.cookies))
    axios.get('http://localhost:8001/tarefas?token=' + req.cookies.token)
        .then(dados => res.render('tarefas', { lista: dados.data }))
        .catch(e => res.render('error', { error: e }))
});*/

router.get('/api/recursos/transferir/:user/:id', function(req, res) {
    res.download('../api-server/uploads/' + req.params.user + "/" + req.params.id)
});

router.get('/api/recursos/eliminar/:id', function(req, res) {
    axios.delete('http://localhost:8001/recursos/eliminar/' + req.params.id + '?token=' + req.cookies.token)
        .then(res.redirect('/api/recursos'))
        .catch(e => res.render('error-user', { message: "Erro ao eliminar!" }))
});

router.get('/api/recursos/eliminar/:id', function(req, res) {
    axios.delete('http://localhost:8001/recursos/eliminar/' + req.params.id + '?token=' + req.cookies.token)
        .then(res.redirect('/api/recursos'))
        .catch(e => res.render('error-user', { message: "Erro ao eliminar!" }))
});

router.get('/api/recursos/avaliar/:id', function(req, res) {
    id = req.params.id
    axios.get('http://localhost:8001/recursos/avaliar/' + req.params.id + '?token=' + req.cookies.token)
        .then(res.redirect('/api/recursos/' + id))
        .catch(res.render('error-user', { message: "Erro ao avaliar!" }))
});


router.get('/api/recurso/:id', function(req, res) {

    axios.get('http://localhost:8001/recurso/' + req.params.id + '?token=' + req.cookies.token)
        .then(dados => res.render('recurso', { r: dados.data[0], permissao: dados.data[1] }))
        .catch(e => res.render('error-user', { message: "Id de recurso inválido!" }))


});


router.get('/api/recursos', function(req, res) {
    axios.get('http://localhost:8001/recursos?titulo=' + req.query.titulo + '&tipo=' + req.query.tipo + '&token=' + req.cookies.token)
        .then(dados => res.render('recursos', { lista: dados.data[0], permissao: dados.data[1] }))
        .catch(e => res.render('autentFalhada', { error: e }))
});

//upload = multer({ dest: 'uploads/' })
router.post('/api/recursos', upload.array('ficheiro'), function(req, res) {

    for (let i = 0; i < req.files.length; i++) {
        console.log('original name ', req.files[i])
    }
    let files = []
    for (let i = 0; i < req.files.length; i++) {
        let info = req.files[i]
        let descricao = req.body.desc
        files[i] = { info, descricao }

    }
    f = JSON.stringify(files)
    axios.post('http://localhost:8001/recursos?token=' + req.cookies.token + '&cont=' + f)
        .then(res.redirect('/api/recursos'))
        .catch(e => res.render('error', { error: e }))

    //res.redirect('/api/recursos')
    /*axios.post('http://localhost:8001/recursos?token=' + req.cookies.token + '&cont=' + req)
        .then(dados => res.render('recursos', { lista: dados.data }))
        .catch(e => res.render('error', { error: e }))*/
});

router.get('/api/users', function(req, res) {
    axios.get('http://localhost:8002/users?username=' + req.query.username + '&level=' + req.query.level)
        .then(dados => res.render('users', { lista_users: dados.data.dados }))
        .catch(e => res.render('autentFalhada', { error: e }))
});

//---------------------------
// --- PRECISO FAZER ISTO ---
//---------------------------

router.post('/api/users', function(req, res) {
    axios.post('http://localhost:8002/users/registar', req.body)
        .then(res.redirect('/api/users'))
        .catch(e => res.render('error', { error: e }))
});

router.get('/api/users/editar/:id', function(req, res) {
    axios.get('http://localhost:8002/users/editar/' + req.params.id)
        .then(res.render('alterUSer-form', { id: req.params.id }))
        .catch(e => res.render('error', { error: e }))
});


router.post('/api/users/editarPass/:id', function(req, res) {
    axios.post('http://localhost:8002/users/editarPass/' + req.params.id, req.body)
        .then(res.redirect('/api/users'))
        .catch(e => res.render('error', { error: e }))
});

router.post('/api/users/editarPerm/:id', function(req, res) {
    axios.post('http://localhost:8002/users/editarPerm/' + req.params.id, req.body)
        .then(res.redirect('/api/users'))
        .catch(e => res.render('error', { error: e }))
});

router.post('/api/users/eliminar/:id', function(req, res) {
    axios.post('http://localhost:8002/users/eliminar/' + req.params.id)
        .then(res.redirect('/api/users'))
        .catch(e => res.render('error', { error: e }))
});
/*
router.get('/tarefas/remover/:id', function(req, res) {
    axios.delete('http://localhost:8001/tarefas/' + req.params.id + '?token=' + req.cookies.token)
        .then(dados => res.redirect('/tarefas'))
        .catch(e => {
            if (e.response.status == 403) {
                res.render('error-level')
            } else res.render('error', { error: e })
        })
});

*/
module.exports = router;