var http = require('http')
var axios = require('axios')
var fs = require('fs')

var static = require('./static.js')

// Chavetas permitem importar parcialmente os modulos
var { parse } = require('querystring')
const { Console } = require('console')

// Funções auxiliares

function recuperaInfo(request, callback) {
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''

        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraListaTarefas(tarefas, d) {
    let pagHTML = `<html>
    <head>
        <title>Lista de tarefas</title>
        <meta charset="utf-8"/> </head> <body></body></html>`
    tarefas.forEach(t => {
        pagHTML += '<h3>Tarefa ' + t.id + '</h3> ' + "<p> Tip:" + t.tipo + "</p>" + "<p> De <b>" + t.datainicio + '</b> a <b>' + t.datafim + "</b> realizado por <b>" + t.pessoa +
            "</b> com o objetivo de <b>" + t.objetivo + "</b></p>"

    })
    pagHTML += `</body></html>`
    return pagHTML
}

function geraPagPrincipal(tarefas, d) {
    let pagHTML = `
    <html>
        <head>
            <title>Lista de tarefas</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="favicon.png"/>
            <link rel="stylesheet" href="public/w3.css"/>
            <style>.row {
                display: flex;
              }

              .column {
                flex: 50%;
                padding: 10px;
                height: 300px; 
              }</style>
        </head>
        <body>` +
        formularioInserirTarefa() + geraTodasTarefas(tarefas) +
        `</body>
    </html>
  `
    return pagHTML
}

function rightPage(tarefas) {
    let pagHTML = `
    <div class="column">
        <div class="w3-container w3-light-blue">
        <h3>Tarefas Realizadas</h3>
        </div>
    <table class="w3-table w3-bordered">
    <tr>
        <th>Id</th>
        <th>Tipo</th>
        <th>Datas</th>
        <th>Quem?</th>
        <th>Descrição</th>
        <th></th>
        <th></th>
    </tr>`
    tarefas.forEach(t => {
        if (t.estado == 1) {
            pagHTML += '<tr><td>' + t.id + '</td>' +
                '<td>' + t.tipo + '</td>' +
                '<td>' + t.datainicio + ' a ' + t.datafim + '</td>' +
                '<td>' + t.pessoa + '</td>' +
                '<td>' + t.objetivo + '</td>' +
                '<td><form class="w3-container" action="/tarefas/' + t.id + '/delete" method="GET">' +
                '<input class="w3-button w3-circle w3-red" type="submit" value="x"/>' +
                '</form></td>' +
                '</tr>'

        }

    });
    pagHTML +=
        `</table>
    </div>
    </div>
    `
    return pagHTML

}



function geraTodasTarefas(tarefas) {

    let pagHTLM = `<div class="w3-container w3-blue-gray">
    <h2>Lista de Tarefas</h2>
</div>

<div class="row">
<div class="column">
  <div class="w3-container w3-light-blue">
    <h3>Tarefas a Realizar</h3>
    </div>
  <table class="w3-table w3-bordered">
  <tr>
      <th>Id</th>
      <th>Tipo</th>
      <th>Datas</th>
      <th>Quem?</th>
      <th>Descrição</th>
      <th></th>
      <th></th>
  </tr>
 `
    tarefas.forEach(t => {
        console.log(t.id)
        if (t.estado == 0)
            pagHTLM += '<tr><td>' + t.id + '</td>' +
            '<td>' + t.tipo + '</td>' +
            '<td>' + t.datainicio + ' a ' + t.datafim + '</td>' +
            '<td>' + t.pessoa + '</td>' +
            '<td>' + t.objetivo + '</td>' +
            '<td><form class="w3-container" action="/tarefas/' + t.id + '/realizada" method="GET">' +
            '<input class="w3-button w3-circle w3-green" type="submit" value="✓"/>' +
            '</form></td>' +
            '<td><form class="w3-container" action="/tarefas/' + t.id + '/editar" method="GET">' +
            '<input class="w3-button w3-circle w3-grey" type="submit" value="✍"/>' +
            '</form></td>'
        '</tr>'

    });

    pagHTLM += '</table></div>' + rightPage(tarefas)
    return pagHTLM
}


// Template para o formulário de Tarefa nova ------------------
function formularioInserirTarefa(d) {
    return `
            <div class="w3-container w3-blue-gray">
                <h2>Registo de Tarefas</h2>
            </div>

            <form class="w3-container" action="/tarefas" method="POST">
                <label class="w3-text-blue-gray"><b>Data de Início</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="datainicio">
          
                <label class="w3-text-blue-gray"><b>Data de Fim</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="datafim">

                <label class="w3-text-blue-gray"><b>Quem realiza?</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="pessoa">

                <label class="w3-text-blue-gray"><b>O que terá de fazer?</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="objetivo">

                <label class="w3-text-blue-gray"><b>Que tipo de tarefa é?</b></label>
                <select name=”tipo">
                  <option>Escolha uma</option>
                  <option>Universidade</option>
                  <option>Trabalho</option>
                  <option>Domestica</option>
              </select>
            
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-blue-gray">
                <address>Gerado para::RPCW2022 em ${d}</address>
            </footer>`
}


function geraPostConfirm(tarefa, d) {
    return `
    <html>
        <head>
            <title>Post receipt: ${tarefa.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.id} inserida.</h1>
            </header>

        <div class="w3-container">
            <p>Registo Efetuado!<a href="/tarefas">Retorne à pagina inicial</a></p>
        </div>

        <footer class="w3-container w3-teal">
            <address>Gerado para::RPCW2022 [<a href="/">Voltar</a>]</address>
        </footer>
    </div>
</body>
</html>
`
}


// Criação do servidor
var tarefasServer = http.createServer(async function(req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    } else {
        switch (req.method) {
            case "GET":
                // GET /tarefas --------------------------------------------------------------------
                if ((req.url == "/") || (req.url == "/tarefas")) {
                    axios.get("http://localhost:3000/tarefas")
                        .then(response => {
                            var tarefas = response.data
                                // Add code to render page with the student's list
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write(geraPagPrincipal(tarefas, d))
                            res.end()
                        })
                        .catch(function(erro) {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Não foi possível obter a lista de tarefas...")
                            res.end()
                        })
                } else if (req.url == "/tarefas/realizadas") {
                    axios.get("http://localhost:3000/tarefas?estado=1")
                        .then(response => {
                            var tarefas = response.data
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write(geraListaTarefas(tarefas, d))
                            res.end()
                        })
                        .catch(function(erro) {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Não foi possível obter a lista de tarefas realizadas...")
                            res.end()
                        })
                } else if (req.url == "/tarefas/arealizar") {
                    axios.get("http://localhost:3000/tarefas?estado=0")
                        .then(response => {
                            var tarefas = response.data
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write(geraListaTarefas(tarefas, d))
                            res.end()
                        })
                        .catch(function(erro) {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Não foi possível obter a lista de tarefas a realizar...")
                            res.end()
                        })
                }
                // GET Marcar uma tarefa como realizada  --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/realizada/.test(req.url)) {
                    var idTarefa = req.url.split("/")[2]
                    axios.get("http://localhost:3000/tarefas/" + idTarefa).then(resp => {
                        console.log("entrei aqui ")
                        const t = resp.data
                        t['estado'] = 1
                        axios.put('http://localhost:3000/tarefas/' + idTarefa, t).then(resp => {
                            res.writeHead(303, { 'Location': '/' }).end()
                        }).catch(erro => {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Erro no PUT: " + erro + '</p>')
                            res.end()
                        })
                    }).catch(error => {
                        console.log(error)
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write(`<p>Não foi possível obter a tarefa ${idTarefa}.</p>`)
                        res.end()
                    })


                } else if (/\/tarefas\/[0-9]+\/delete\/?/.test(req.url)) {
                    const task_id = req.url.split('/')[2]
                    axios.delete('http://localhost:3000/tarefas/' + task_id).then(resp => {
                        res.writeHead(303, { 'Location': '/' }).end()
                    }).catch(erro => {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>Erro no DELETE: " + erro + '</p>')
                        res.end()
                    })

                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                if (req.url == '/tarefas') {
                    recuperaInfo(req, resultado => {
                        console.log('Post de tarefa:' + JSON.stringify(resultado))
                        console.log(resultado)
                        resultado["estado"] = 0
                        resultado["tipo"] = resultado["”tipo\""]
                        axios.post('http://localhost:3000/tarefas', resultado)
                            .then(resp => {
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                res.write(geraPostConfirm(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                res.write('<p>Erro no post' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    res.write('<p>Erro no post' + erro + '</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default:
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

tarefasServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')