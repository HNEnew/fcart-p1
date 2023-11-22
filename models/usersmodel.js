const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    uname: {
        type:String,
        required: [true , 'Username is required . '],
        validate: {
            validator:(value)=>{
                return value.length >= 3
            },
            message: 'Name should be at least 3 characters long . '
        }
    },
    email: {
        type:String,
        required: [true , 'Email is required '],
        unique: true
    },
    password: {
        type:String,
        required: [true , 'Password is required . '],
        minlength: [3 , 'Minimum password length is 3 characters . ']
    },
    status: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        required: [true , 'Phone number is required . '],
        validate: {
            validator:(value)=>{
                return value.length >= 10 && value > 1000000000
            },
            message: 'Please enter a valid mobile number . '
        }
    },
    terms: {
        required: false
    },
    wallet: {
        type:Number,
        default: 0
    }
}, {timestamps: true}) 

const user= mongoose.model('user', userSchema)
module.exports = user




