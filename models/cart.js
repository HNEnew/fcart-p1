const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity: {
            type: Number,
            default: 1
        },
        totalcost: {
            type: Number,
            default: 0
        },
        size: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }  
    }],
    cartTotal: {
        type: Number,
        default: 0
    }
});


const cart = mongoose.model('cart', cartSchema);

module.exports = cart;