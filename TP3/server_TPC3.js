var http = require('http')
var url = require('url')
const axios = require('axios');

headOfpage = '<head>\n' + 
            '<meta charset="UTF-8"/>\n'+
            '<style> table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; }' + 
            'td, th { border: 1px solid #dddddd; text-align: left;padding: 8px;} ' +
            'tr:nth-child(even) { background-color: #dddddd;}'+
            'ul { display: table; margin: 40 ; }' + 
            '</style>'+
        '</head>\n'

function generateMainPage()
{
    page='<html>\n ' + 
    '<head>\n' + 
        '<meta charset="UTF-8"/>\n'+
    '</head>\n'+
    '<body><center><h1>Escola de Música! </h1>' + 
         '<h2>Ao que pretende aceder? </h2>' +
         
         '<li><h3> <a href="http://localhost:4000/alunos"> Lista de alunos </a> </h3></li>\n'+
         '<li><h3> <a href="http://localhost:4000/instrumentos"> Lista de instrumentos </a></h3> </li>\n'+
         '<li><h3> <a href="http://localhost:4000/cursos"> Lista de Cursos </a>  </h3></li>\n'+
        
    
         '</center></body>'+
         '</html>'

    return page;
}



  

async function generateTabelaAlunosPage()
{
    page='<html>\n ' 
    page += headOfpage
        
    page += '<body><h1> Lista de Alunos!</h1> ' +
            '<table border="1">'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Nome</th>'+
                '<th>Data Nascimento</th>'+
                '<th>Curso</th>'+
                '<th>Ano do Curso</th>'+
                '<th>Instrumento</th>'+
            '</tr>'
    try{
     await axios.get('http://localhost:3000/alunos')
    .then(function(resp) {
        pubs = resp.data;
        pubs.forEach(p => {
            id = `${p.id}`
            nome =`${p.nome}`
            birthday = `${p.dataNasc}`
            curso = `${p.curso}`
            anoCurso = `${p.anoCurso}`
            instrumento = `${p.instrumento}`
            page += '<tr>'+
            '<td>' + id + '</td>' + '<td>' + nome + '</td>' +'<td>' + birthday + '</td>' + 
            '<td>' + curso + '</td>' + '<td>' + anoCurso + '</td>' + '<td>' + instrumento + '</td>' + 
                '</tr>'
        });
       
    })
    .catch(function(error) {
        console.log(error);
    });}
    catch(error){
        console.log(error);
    }
    
    page += '</table></body></html>'

    return page;
}
async function generateTabelaInstrumentosPage()
{
    page='<html>\n ' 
    page += headOfpage
        
    page += '<body><h1> Lista de Instrumentos!</h1> ' +
            '<table border="1">'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Descrição</th>'+
            '</tr>'
    try{
     await axios.get('http://localhost:3000/instrumentos')
    .then(function(resp) {
        pubs = resp.data;
        pubs.forEach(p => {
            id = `${p.id}`
            text =`${p['#text']}`
            page += '<tr>'+ '<td>' + id + '</td>' +'<td>' + text + '</td>' +'</tr>'
        });
       
    })
    .catch(function(error) {
        console.log(error);
    });}
    catch(error){
        console.log(error);
    }
    
    page += '</table></body></html>'

    return page;
}


async function generateTabelaCursosPage()
{
    page='<html>\n ' 
    page += headOfpage
        
    page += '<body><h1> Lista de Cursos!</h1> ' +
            '<table border="1">'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Designação</th>'+
                '<th>Duração</th>'+
                '<th>Id do Instrumento</th>'+
                '<th>Tipo do Instrumento</th>'+
            '</tr>'
    try{
     await axios.get('http://localhost:3000/cursos')
    .then(function(resp) {
        pubs = resp.data;
        pubs.forEach(p => {
            id = `${p.id}`
            designacao = `${p.designacao}`
            duracao = `${p.duracao}`
            instrumento_Id = `${p.instrumento.id}`
            instrumento_Desc = `${p.instrumento['#text']}`
            page += '<tr>'+ '<td>' + id + '</td>' +'<td>' + designacao + '</td>' +
            '<td>' + duracao + '</td>' +'<td>' +instrumento_Id + '</td>' +
            '<td>' + instrumento_Desc + '</td>' +'</tr>'
        });
       
    })
    .catch(function(error) {
        console.log(error);
    });}
    catch(error){
        console.log(error);
    }
    
    page += '</table></body></html>'

    return page;
}


http.createServer(async function(req, res){
   // var d = new Date().toISOString().substring(0,16)
    //console.log(req.method + "" + req.url + " " + d)
    var myurl = url.parse(req.url, true).pathname
   
    if(myurl == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(generateMainPage())
        res.end()

    }else if(myurl == "/alunos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await generateTabelaAlunosPage())
        res.end()

    } else if(myurl == "/instrumentos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await generateTabelaInstrumentosPage())
        res.end()

    }else if(myurl == "/cursos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await generateTabelaCursosPage())
        res.end()
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write('<p>Rota não Suportada: ' + req.url + '</p>')
        res.end()
    }
    
    
}).listen(4000)