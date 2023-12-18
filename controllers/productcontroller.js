const user = require('../models/usersmodel')
const product = require('../models/product');
const category = require('../models/category');
const cart = require('../models/cart');
const coupon = require('../models/coupon')
const order = require('../models/order')




module.exports.products_get = async (req, res) => {
    try {
        const products = await product.find({})
        res.render('products', { products })
    } catch (error) {
        console.log(error)
    }
}
module.exports.addproducts_get = async (req, res) => {
    
    try {
        const categories = await category.find({})
        res.render('addproduct', { categories })
    } catch (error) {
        console.log(error)
    }
}
module.exports.addproducts_post = async (req, res) => {
    const { name, code, cost, profit, size, stock, category } = req.body
    
    const image = req.files.map(file => file.originalname)
   
    const newproduct = new product({
        name: name,
        code: code,
        cost: cost,
        profit: profit,
        size: size,
        stock: stock,
        category: category,
        image: image
    })
    const result = await newproduct.save(err => {
        if (err) {
            
            console.log(err)
            res.json({ failure: 'something wrong...' })
        } else {
            
            res.json({ succes: 'product entered...' })
        }
    })
}
module.exports.productdetails_get = async (req, res) => {
    const productcode = req.query.code
    
    try {
        const productdetails = await product.findOne({ code: productcode })
    
        res.render('admin-productdetails', { productdetails })
    } catch (error) {
        console.log(error)
    }
}
module.exports.productedit_get = async (req, res) => {
    try {
        const productcode = req.query.code
        
        const [productdetails, categories] = await Promise.all([
            product.findOne({ code: productcode }),
            category.find({})
        ])
        res.render('editproduct', { productdetails, categories })
        
    } catch (Error) {
        console.log(Error);
    }
}
module.exports.editproducts_post = async (req, res) => {
    const { id, name, code, cost, profit, size, stock, category } = req.body
    
    const image = req.files.map(file => file.originalname)
    
    const imagesArray = (req.query.imagearr).split(',')
    
    try {
        const result = await product.updateMany({ _id: id }, { $set: { name: name, code: code, cost: cost, profit: profit, size: size, stock: stock, category: category, image: imagesArray } })
       
        if (result.modifiedCount == 1) {
            res.json({ succes: 'productdetails updated...' })
        } else {
            res.json({ failure: 'Oops....something wrong...' })
        }
    } catch (Error) {
        console.log(Error);
    }
}
module.exports.product_delete = async (req, res) => {
    
    const id = req.body.id
    try {
        const productdetails = await product.findOne({ _id: id })
        
        let result
        if (productdetails.deleted) {
            result = await product.updateOne({ _id: id },{$set: {deleted: false}});    
        } else {
            result = await product.updateOne({ _id: id },{$set: {deleted: true}});
        }
        
        if (result.modifiedCount == 1) {
            res.json({ succes: 'product status updated succesfully..' })
        }
    } catch (err) {
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}
