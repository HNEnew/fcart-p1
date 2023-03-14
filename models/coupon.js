const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: {
        required: true,
        type: String
    },
    discount: {
        required: true,
        type: Number
    },
    expired: {
        type: Boolean,
        default:false
    },
    usedusers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    expiryDate: {
        type: Date,
        required:true,
        expires: 0
    }
})

const coupon = mongoose.model('coupon',couponSchema)
module.exports = coupon



