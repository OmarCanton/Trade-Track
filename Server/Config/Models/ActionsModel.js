const mongoose = require('mongoose')

const ActionSchema = mongoose.Schema({
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

module.exports = mongoose.model('Actions', ActionSchema)