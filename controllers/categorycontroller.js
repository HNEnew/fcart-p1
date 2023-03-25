const user = require('../models/usersmodel')
const product = require('../models/product');
const category = require('../models/category');



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
    const image = req.file.originalname
    const name = req.body.name
    console.log(image)
    const newcategory = new category({
        name: name,
        image: image
    })
    const result = await newcategory.save((err) => {
        if (err) {
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
    const image = req.file.originalname
    console.log(image)
    const name = req.body.name
    try {
        const categories = await category.find({ _id: id })
        console.log(categories);
        const result = await category.updateOne({ _id: id } , {$set: {name: name , image: image } });
        console.log(result)
        if (result) {
            res.json({ succes: 'category deleted succesfully..' })
        }
    } catch (err) {
        console.log(err.message)
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}