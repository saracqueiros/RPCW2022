var mongoose = require("mongoose")

var ficheiroSchema = new mongoose.Schema({
    data: String,
    _id: String,
    mimetype: String,
    descricao: String
})

module.exports = mongoose.model('ficheiro', ficheiroSchema)