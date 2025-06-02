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

const Products = mongoose.model('Products', ProductSchema)
module.exports = Products