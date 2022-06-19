// Controlador para o modelo Tarefa

var Recurso = require('../models/recurso')

// Devolve a lista de Tarefas
module.exports.listar = () => {
    return Recurso
        .find()
        .exec()
}

module.exports.consultarPorId = id => {
    return Recurso
        .findOne({ _id: id })
        .exec()
}

module.exports.consultarPorTitulo = t => {
    return Recurso
        .find({ titulo: { $regex: t } })
        .exec()
}

module.exports.consultarPorTipo = t => {
    return Recurso
        .find({ tipo: t })
        .exec()
}

module.exports.inserir = t => {
    var novo = new Recurso(t)
    return novo.save()
}

module.exports.remover = function(id) {
    return Recurso.deleteOne({ _id: id })
}

module.exports.consultarPorTipo = t => {
    return Recurso
        .find({ tipo: { $regex: t } })
        .exec()
}

module.exports.alterar = function(t) {
    return Recurso.findByIdAndUpdate({ _id: t._id }, t, { new: true })
}

module.exports.getPathById = function(id) {
    return Recurso.findOne({ _id: id })
}

module.exports.update = function(id, descc, produtorr, cria, subm) {
    return Recurso.updateOne({ _id: id }, { titulo: tit, desc: descc, produtor: produtorr, submissao: subm, criacao: cria }).exec()
}
module.exports.comentar = function(id, com, userInp, avaliac) {
    return Recurso.updateOne({ _id: id }, { $push: { comentarios: { comm: com, user: userInp, aval: avaliac } } }).exec()
}

module.exports.addAval = id => {
    return Recurso.updateOne({ _id: id }, { $push: { avaliacao: { s } } })

}