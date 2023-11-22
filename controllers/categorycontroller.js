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
    console.log(categories)
    res.render('category', { categories })
}
module.exports.categoryadd_get = (req, res) => {
    console.log("category add page...")
    res.render('addcategory')
}
module.exports.categoryadd_post = async (req, res) => {

    console.log("image saved")
    console.log(req.body);
    let image =''
    if (req.file){
        image = req.file.originalname
    }
    const name = req.body.name
    console.log(image)
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
            console.log('category added succesfully...')
            res.json({ succes: 'category added succesfully...' })
        }
    })
}
module.exports.editcategory_put = async (req, res) => {
    console.log(req.body);
    const id = req.query.id
    console.log(id)
    let image
    if(req.file) {
        image = req.file.originalname
    } else {
        image = req.body.image
    }
    console.log(image)
    const name = req.body.name
    try {
        const result = await category.updateOne({ _id: id } , {$set: {name: name , image: image } });
        console.log(result)
        if (result) {
            res.json({ succes: 'category edited succesfully..' })
        }
    } catch (err) {
        const errors = heandleErrors(err)
        console.log(errors)
        console.log(err.message)
        res.json({ failure: err.message })
        // res.json({ failure: 'Oops...Something went wrong..' })
    }
}