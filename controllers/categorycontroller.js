const user = require('../models/usersmodel')
const product = require('../models/product');
const category = require('../models/category');

// handle errors
const heandleErrors = (err) => {
    console.log(err.message , err.code)
    let errors = { name: '' , image: '' }

    // validation errors
    if (err.message.includes('category validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    } else if (err.code == 11000){
        err.message = 'category name already exists..'
    }
}



module.exports.category_get = async (req, res) => {
    const categories = await category.find({})
    
    res.render('category', { categories })
}
module.exports.categoryadd_get = (req, res) => {
    
    res.render('addcategory')
}
module.exports.categoryadd_post = async (req, res) => {

    
    let image =''
    if (req.file){
        image = req.file.originalname
    }
    const name = req.body.name
    
    const newcategory = new category({
        name: name,
        image: image
    })
    const result = await newcategory.save((err) => {
        if (err) {
                console.log(err)
                const errors = heandleErrors(err)
            console.log(errors)
            console.log(err.message)
            res.json({ failure: err.message })
        } else {
            
            res.json({ succes: 'category added succesfully...' })
        }
    })
}
module.exports.editcategory_put = async (req, res) => {
    
    const id = req.query.id
    
    let image
    if(req.file) {
        image = req.file.originalname
    } else {
        image = req.body.image
    }
    
    const name = req.body.name
    try {
        const result = await category.updateOne({ _id: id } , {$set: {name: name , image: image } });
        
        if (result) {
            res.json({ succes: 'category edited succesfully..' })
        }
    } catch (err) {
        const errors = heandleErrors(err)
        console.log(errors)
        console.log(err.message)
        res.json({ failure: err.message })
       
    }
}