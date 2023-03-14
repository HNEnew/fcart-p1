const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
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
        }
    }],
    totalamount: {
        type: Number,
        default: 0
    },
    coupon: {
        type: Object
    },
    finalamount: {
        type: Number,
        default: 0
    },
    paymentmethod: {
        type: String
    },
    billingdetails: {
        type: Object,
        required: true
    },
    status: {
        type: String
    },
    orderid: {
        type: Number
    },
    delivery: {
        type: Date,
        default: Date.now()
    }
},{timestamps: true})

const order = mongoose.model('order', orderSchema)

module.exports = order




