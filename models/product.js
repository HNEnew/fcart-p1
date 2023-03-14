const mongoose = require('mongoose')

// addnew product schema:---
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    code: {type: String, required: true},
    cost: {type: String, required: true}, 
    profit: {type: String, required: true}, 
    size: {type: String, reuired: false}, 
    stock: {type: String, required: true}, 
    category: {type: String, required: true},
    image: {type: Array, required: true}
})
const newproduct = mongoose.model('product',productSchema)

module.exports = newproduct

