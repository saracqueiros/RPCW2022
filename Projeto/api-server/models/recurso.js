const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    criacao: String,
    submissao: String,
    produtor: String,
    submissor: String,
    titulo: String,
    tipo: String,
    desc: String,
    size: String,
    path: String,
    downloads: String,
    comentarios: [{
        comm: String,
        user: String,
        aval: String,
    }]

});

module.exports = mongoose.model('recurso', recursoSchema)