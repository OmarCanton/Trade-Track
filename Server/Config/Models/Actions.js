const mongoose = require('mongoose')

const ActionSchema = new mongoose.Schema({
    userId: String,
    action: String,
    reason: String,
    name: String,
    quantitySold: Number,
    totalPrice: Number,
    date: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Action = mongoose.model('Actions', ActionSchema)
module.exports = Action