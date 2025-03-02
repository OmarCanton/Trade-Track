const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: String,
    image: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('Categories', CategorySchema)