var http = require('http')
var fs = require('fs')
var url = require('url')

function constructHMTL (element){
    return '<html>\n ' + 
    '<head>\n' + 
        '<meta charset="UTF-8"/>\n'+
    '</head>\n'+
    '<body>\n'+
        '<h1>Filme: "' + element['title'] + '"</h1>\n'+
        '<ul>'+
        '<li> O filme foi produzido em <b>'+  element['year'] + '</b>.</li>\n'+
        '<li> Com o elenco de <b>'+  element['cast'] + '</b>.</li>\n'+
        '<li> Insere-se nos estilos: <b>'+  element['genres'] + '</b>.</li>\n'+
        '</ul>'+
    '</body>'+
'</html>'
}

function allMoviesToFile(allMovies){
    allMovies.sort(function (a, b) {
        return (a.filme > b.filme) ? 1 : ((b.filme > a.filme) ? -1 : 0);
    });
    var contentFile ='<html>\n ' + 
            '<head>\n' + 
                '<meta charset="UTF-8"/>\n'+
            '</head>\n'+
            '<body>\n'+
                '<h1> Lista de filmes disponível: </h1>\n'+
                '<ul>'

    allMovies.forEach(element => {
        contentFile = contentFile +  '<li> <a href="http://localhost:9876/filmes/f' + element.cont + '"' + '> '+ element.filme +' </a></li>\n'
});
    fs.writeFile('./filmes.html', contentFile, err => {
        if (err) console.log("Problema a escrever no ficheiro...");
    } );
    contentFile = contentFile + '</ul>'+
            '</body>'+
            '</html>'
}

fs.readFile('./filmes.json', (err,data) => {
    if(err) console.log("Erro na leitura do ficheiro...");
    else {
        var cont = 0;
        var allMovies = [];
        let jsonData = JSON.parse(data);
        jsonData.forEach(element => {
            var contentFile = constructHMTL(element)
            fs.writeFile('./filmes/f' + cont + '.html', contentFile, err => {
                if (err) console.log("Problema a escrever no ficheiro...");
            } );
            
            allMovies[cont] = { cont: cont, filme : element['title']};
            cont += 1;
        });
      
    
        allMoviesToFile(allMovies);
    }
});

//console.log("Vou imprimir isto depois de ler ")


http.createServer(function(req, res){
    var myurl = req.url.substring(1)
    fs.readFile('./' +myurl +'.html', function(err,data){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if(err){
            res.write("<p> Erro na leitura do ficheiro...</p>")
        }
        else{
            res.write(data)
        }
        res.end()
    })
     
    
}).listen(9876)