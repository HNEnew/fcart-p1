const category = require('../models/category')
const product = require('../models/product')
const cart = require('../models/cart')
const wishlist = require('../models/wishlist')



module.exports.wishlist_get = async (req, res) => {
    const userdata = req.userdata
    const [categories, wishlistdetails, products, cartdetails] = await Promise.all([
        category.find({}),
        wishlist.findOne({ user: userdata._id })
            .populate('items'),
        product.find({}),
        cart.findOne({ owner: userdata._id })
            .populate('items.product')
    ])
    console.log(wishlistdetails)
    res.render('wishlist', { categories, wishlistdetails, userdata, products })
}
module.exports.addtowishlist_post = async (req, res) => {
    const productid = req.body.productid
    const userdata = req.userdata
    console.log(req.body)
    const wishlistexist = await wishlist.findOne({ user: userdata._id })
    console.log(wishlistexist)
    const newWishlist = new wishlist({
        user: userdata._id,
        items: [productid]
    })
    try {
        if (wishlistexist) {
            console.log(wishlistexist)
            if (wishlistexist.items.includes(productid)) {
                res.json({ failure: 'Item exist in wishlist..' })
            } else {
                const result = await wishlist.updateOne({ user: userdata._id }, { $push: { items: productid } })
                console.log(result)
                if (result.modifiedCount == 0) {
                    res.json({ failure: 'Something error...' })
                } else {
                    res.json({ succes: '1 item added to wishlist succesfully..' })
                }
            }
        } else {
            newWishlist.save(err => {
                if (err) {
                    console.log(err)
                    res.json({ failure: 'Something error...' })
                } else {
                    res.json({ succes: '1 item added to wishlist succesfully..' })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}