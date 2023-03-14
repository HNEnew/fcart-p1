const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    uname: {
        type:String,
        required: true,
        validate: {
            validator:(value)=>{
                return value.length >= 3
            }
        },
        message: 'Name should be at least 3 characters long'
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        required: false
    },
    terms: {
        required: false
    }
}, {timestamps: true}) 

const user= mongoose.model('user', userSchema)
module.exports = user




