const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        required: [true, 'Name is required'],
        type: String,
        unique: [true, 'This category already exists'],
        validate: {
            validator: function (value) {
                return !/[^a-zA-Z0-9 ]/.test(value);
            },
            message: 'Name can only contain alphanumeric characters and spaces'
        }
    },
    image: {
        required: [true, 'image is required'],
        type: String
    }

})
const newcategory = mongoose.model('category',categorySchema)

module.exports = newcategory


  