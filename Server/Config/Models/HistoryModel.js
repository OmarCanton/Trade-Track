const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    userId: String,
    name: String,
    category: String,
    quantity: Number,
    price: Number,
    status: String,
    date: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('History', HistorySchema)