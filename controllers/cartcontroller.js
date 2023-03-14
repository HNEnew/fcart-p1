const user = require('../models/usersmodel')
const product = require('../models/product');
const category = require('../models/category');
const address = require('../models/address')
const cart = require('../models/cart')
const coupon = require('../models/coupon');
const order = require('../models/order')



module.exports.cart_get = async (req, res) => {
    try {
        const userdata = req.userdata
        let [categories, cartdetails] = await Promise.all([
            category.find({}),
            cart.findOne({ owner: userdata._id })
                .populate('items.product')
        ])
        if (cartdetails == null) { cartdetails = false }
        console.log(cartdetails)
        console.log(cartdetails.items[0].product)
        if (userdata) {
            res.render('cart', { categories, userdata, cartdetails })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.cart_get = async (req, res) => {
    try {
        const userdata = req.userdata
        let [categories, cartdetails] = await Promise.all([
            category.find({}),
            cart.findOne({ owner: userdata._id })
                .populate('items.product')
        ])
        if (cartdetails == null) { cartdetails = false }
        console.log(cartdetails)
        if (userdata) {
            res.render('cart', { categories, userdata, cartdetails })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.addtocart_post = async (req, res) => {
    const { productid, userid, quantity } = req.body
    const [productdetails, cartexist] = await Promise.all([
        product.findOne({ _id: productid }),
        cart.findOne({ owner: userid })
    ])
    const totalcost = productdetails.cost * quantity
    if (cartexist) {
        try {
            const productexistincart = await cart.findOne({ owner: userid, "items.product": productid })
            if (productexistincart) {
                console.log('----------------------productexistincart');
                const result = await cart.updateOne({ owner: userid, "items.product": productid }, { $inc: { "items.$.quantity": quantity , cartTotal: totalcost, "items.$.totalcost": totalcost } })
                console.log(result)
                if (result.modifiedCount == 0) {
                    res.json({ failure: 'Product exist in cart , But Something error..Data not saved' })
                } else {
                    res.json({ succes: 'Product added to cart succesfully..' })
                }
            } else {
                console.log('----------------------cartexistsbutnoproduct');
                const result = await cart.updateOne({ owner: userid }, { $push: { items: [{ product: productid, quantity: quantity, totalcost: totalcost, size: productdetails.size }] }, $inc: { cartTotal: totalcost } })
                console.log(result)
                if (result.modifiedCount == 1) {
                    res.json({ succes: 'Product added to cart succesfully..' })
                } else {
                    res.json({ failure: 'Product not exist in cart , But Something error..Data not saved' })
                }
            }
        } catch (Error) {
            console.log(Error);
        }
    } else {
        const newcart = new cart({
            owner: userid,
            items: [{ product: productid, quantity: quantity, totalcost: totalcost, size: productdetails.size }],
            cartTotal: totalcost
        })
        try {
            const result = await newcart.save(err => {
                if (err) {
                    res.json({ failure: 'Something error..Data not saved' })
                } else {
                    res.json({ succes: 'Product added to cart succesfully' })
                }
            })
        } catch (Error) {
            console.log(Error);
        }
    }
}
module.exports.cancelitem_post = async (req, res) => {
    const { cartid, productid, totalcost } = req.body
    try {
        const result = await cart.updateOne({ _id: cartid }, { $pull: { items: { _id: productid } }, $inc: { cartTotal: -totalcost } })
        console.log(result)
        if (result.modifiedCount == 1) {
            res.json({ succes: 'Data deleted succesfully' })
        } else {
            res.json({ failure: 'Something error..Data not deleted' })
        }
    } catch (Error) {
        console.log(Error);
    }
}
module.exports.quantityminus_put = async (req, res) => {
    const { productid, quantity } = req.body
    const userid = req.userdata._id
    const productdetails = await product.findOne({ _id: productid })
    const totalcost = productdetails.cost * quantity
    try {
        if (quantity - 1 > 0) {
            const result = await cart.updateOne({ owner: userid, "items.product": productid }, { $inc: { "items.$.quantity": -1, "items.$.totalcost": -productdetails.cost, cartTotal: -productdetails.cost } })
            console.log(result)
            if (result.modifiedCount == 1) {
                console.log(quantity-1 <productdetails.stock)
                if (quantity-1 <productdetails.stock) {
                    res.json({ stock: 'Quantity reduction succesful...' })
                } else {
                    res.json({ nostock: 'Quantity reduction succesful...' })   
                }
            } else {
                res.json({ failure: 'Oops...Something wrong...' })
            }
        } else {
            res.json({ failure: 'Oops...Something wrong...' })
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.quantityplus_put = async (req, res) => {
    const { productid, quantity } = req.body
    const userid = req.userdata._id
    const productdetails = await product.findOne({ _id: productid })
    try {
        const result = await cart.updateOne({ owner: userid, "items.product": productid }, { $inc: { "items.$.quantity": 1, "items.$.totalcost": productdetails.cost , cartTotal: productdetails.cost} })
        console.log(result)
        if (result.modifiedCount == 1) {
            if (productdetails.stock - quantity > 0) {
                res.json({ stock: 'In stock' })
            } else {
                res.json({ nostock: 'Not enough stock' })
            }
        }
        else {
            res.json({ failure: 'Oops..Something error...' })
        }
    } catch (error) {
        console.log(error)
    }
}

