const mongoose = require('mongoose')
const {isEmail} = require('validator')

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true, 'Please enter a password '],
        minlength:[6, 'Password must have minimum 6 charachters']
    }
})
const Admin = mongoose.model('admin',adminSchema)

module.exports = Admin  
