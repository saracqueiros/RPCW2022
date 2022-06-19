// Controlador para o modelo User

var User = require('../models/user')

// Devolve a lista de Users
module.exports.listar = () => {
    return User
        .find()
        .sort('username')
        .exec()
}

module.exports.consultar = uname => {
    return User
        .findOne({ username: uname })
        .exec()
}

module.exports.consultarPorUsername = u => {
    return User
        .find({ username: { $regex: u } })
        .exec()
}

module.exports.consultarPorLevel = l => {
    return User
        .find({ level: l })
        .exec()
}

module.exports.inserir = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.remover = function(id) {
    return User.deleteOne({ _id: id })
}

module.exports.alterar = function(u) {
    return User.findByIdAndUpdate({ username: u.username }, u, { new: true })
}

module.exports.updateLevel = function(user, l) {
    return User.updateOne({ _id: user }, { level: l }).exec()
}

module.exports.updatePassword = function(id, pass) {
    return User.updateOne({ _id: id }, { passwords: pass }).exec()
}