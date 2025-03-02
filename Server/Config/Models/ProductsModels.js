const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    quantity: Number,
    category: {
        type: String,
        required: true
    },
    price: { 
        type: Number,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Products', ProductSchema)