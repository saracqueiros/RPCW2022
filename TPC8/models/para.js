var mongoose = require('mongoose')

var paraSchema = new mongoose.Schema({
    date: String,
    para: String
})

module.exports = mongoose.model('para', paraSchema)