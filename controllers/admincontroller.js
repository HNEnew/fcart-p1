const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { findOne } = require('../models/admin');
const user = require('../models/usersmodel')
const product = require('../models/product');
const category = require('../models/category');
const cart = require('../models/cart');
const coupon = require('../models/coupon')
const order = require('../models/order')

// payload & secretkey for jsonwebtoken
const payload = {
    userid: 'test@123'
}
const secretkey = 'mysecretkey'

const Ademail = 'test@123'
const Adpassword = '123456'

module.exports.login_get = function (req, res, next) {
    console.log('login page..')
    res.render('adminlogin')
}
module.exports.login_post = async function (req, res) {
    const { email, password } = req.body
    try {
        console.log('email & password rcvd ...')
        if (email == Ademail && password == Adpassword) {
            const token = await jwt.sign(payload, secretkey)
            console.log(token)
            res.cookie('itsadmin', token, { httpOnly: true })
            res.json({ succes: 'authentication succes' })
        } else {
            res.json({ message: 'invalid email or password !' })
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.home_get = async (req, res) => {
    const salesdetails = await order.find({ status: 'Delivered' }).populate('items.product').populate('user').sort({ createdAt: -1 })
    console.log(salesdetails)
    const sales = []
    const profit = []
    const date = []
    for (var i = 0; i < salesdetails.length; i++) {
        sales.push(salesdetails[i].finalamount)
        date.push(salesdetails[i].delivery.toDateString())
        let profitsum = 0
        for (var j = 0; j < salesdetails[i].items.length; j++) {
            profitsum += salesdetails[i].items[j].quantity * salesdetails[i].items[j].product.profit
        }
        profit.push(profitsum)
    }
    console.log(sales, profit, date)
    res.render('adminhomenew', { salesdetails, sales, profit, date })
}
module.exports.chart_get = async (req, res) => {
    try {
        const salesdetails = await order.find({ status: 'Delivered' }).populate('items.product')
        const sales = []
        const profit = []
        const date = []
        for (var i = 0; i < salesdetails.length; i++) {
            sales.push(salesdetails[i].finalamount)
            date.push(salesdetails[i].delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            let profitsum = 0
            for (var j = 0; j < salesdetails[i].items.length; j++) {
                profitsum += salesdetails[i].items[j].quantity * salesdetails[i].items[j].product.profit
            }
            profit.push(profitsum)
        }
        console.log(sales, profit, date)
        res.json({ sales, profit, date })
    } catch (error) {
        console.log(error)
    }
}

module.exports.allsales_get = async (req, res) => {
    try {
        const salesdetails = await order.find({ status: 'Delivered' }).populate('items.product').populate('user').sort({ createdAt: -1 })
        // console.log(salesdetails)
        const sales = []
        const profit = []
        const date = []
        for (var i = 0; i < salesdetails.length; i++) {
            sales.push(salesdetails[i].finalamount)
            date.push(salesdetails[i].delivery.toDateString())
            let profitsum = 0
            for (var j = 0; j < salesdetails[i].items.length; j++) {
                profitsum += salesdetails[i].items[j].quantity * salesdetails[i].items[j].product.profit
            }
            profit.push(profitsum)
        }
        res.render('allsales', { salesdetails, sales, profit, date })
    } catch (error) {
        console.log(error)
    }
}
module.exports.users_get = async (req, res) => {
    try {
        const userdetails = await user.find({})
        res.render('users', { userdetails })
    } catch (error) {
        console.log(error)
    }
}
module.exports.userblock_post = async (req, res) => {
    console.log(req.body);
    const id = req.body.id
    try {
        const userdetails = await user.find({ _id: id })
        console.log(userdetails);
        const result = await user.updateOne({ _id: id }, { $set: { status: false } });
        console.log(result.updatedCount);
        if (result.updatedCount == 1) {
            res.json({ succes: 'user blocked..' })
        }
    } catch (err) {
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}
module.exports.userunblock_post = async (req, res) => {
    console.log(req.body);
    const id = req.body.id
    try {
        const userdetails = await user.find({ _id: id })
        console.log(userdetails);
        const result = await user.updateOne({ _id: id }, { $set: { status: true } });
        console.log(result.updatedCount);
        if (result.updatedCount == 1) {
            res.json({ succes: 'user active..' })
        }
    } catch (err) {
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}
// module.exports.products_get = async (req, res) => {
//     try {
//         const products = await product.find({})
//         res.render('products', { products })
//     } catch (error) {
//         console.log(error)
//     }
// }
// module.exports.addproducts_get = async (req, res) => {
//     console.log("addproduct page...")
//     try {
//         const categories = await category.find({})
//         res.render('addproduct', { categories })
//     } catch (error) {
//         console.log(error)
//     }
// }
// module.exports.addproducts_post = async (req, res) => {
//     const { name, code, cost, profit, size, stock, category } = req.body
//     console.log(req.body)
//     const image = req.files.map(file => file.originalname)
//     console.log(image);
//     const newproduct = new product({
//         name: name,
//         code: code,
//         cost: cost,
//         profit: profit,
//         size: size,
//         stock: stock,
//         category: category,
//         image: image
//     })
//     const result = await newproduct.save(err => {
//         if (err) {
//             console.log('hello again cannot enter new products - error.........');
//             console.log(err)
//             res.json({ failure: 'something wrong...' })
//         } else {
//             console.log('product entered succesfullly..')
//             res.json({ succes: 'product entered...' })
//         }
//     })
// }
// module.exports.productdetails_get = async (req, res) => {
//     const productcode = req.query.code
//     console.log(productcode);
//     try {
//         const productdetails = await product.findOne({ code: productcode })
//         console.log(productdetails);
//         res.render('admin-productdetails', { productdetails })
//     } catch (error) {
//         console.log(error)
//     }
// }
// module.exports.productedit_get = async (req, res) => {
//     try {
//         const productcode = req.query.code
//         console.log(productcode);
//         const [productdetails, categories] = await Promise.all([
//             product.findOne({ code: productcode }),
//             category.find({})
//         ])
//         res.render('editproduct', { productdetails, categories })
//         console.log(productdetails);
//     } catch (Error) {
//         console.log(Error);
//     }
// }
// module.exports.editproducts_post = async (req, res) => {
//     const { id, name, code, cost, profit, size, stock, category } = await req.body
//     console.log(req.body)
//     const image = req.files.map(file => file.originalname)
//     console.log(image);
//     try {
//         const result = await product.updateMany({ _id: id }, { $set: { name: name, code: code, cost: cost, profit: profit, size: size, stock: stock, category: category, image: image } })
//         console.log(result)
//         if (result.modifiedCount == 1) {
//             res.json({ succes: 'productdetails updated...' })
//         } else {
//             res.json({ failure: 'Oops....something wrong...' })
//         }
//     } catch (Error) {
//         console.log(Error);
//     }
// }
// module.exports.category_get = async (req, res) => {
//     const categories = await category.find({})
//     console.log(categories)
//     res.render('category', { categories })
// }
// module.exports.categoryadd_get = (req, res) => {
//     console.log("category add page...")
//     res.render('addcategory')
// }
// module.exports.categoryadd_post = async (req, res) => {

//     console.log("image saved")
//     console.log(req.body);
//     const image = req.file.originalname
//     const name = req.body.name
//     console.log(image)
//     const newcategory = new category({
//         name: name,
//         image: image
//     })
//     const result = await newcategory.save((err) => {
//         if (err) {
//             console.log(err.message)
//             res.json({ failure: err.message })
//         } else {
//             console.log('category added succesfully...')
//             res.json({ succes: 'category added succesfully...' })
//         }
//     })
// }
// module.exports.category_delete = async (req, res) => {
//     console.log(req.body);
//     const id = req.body.id
//     try {
//         const categories = await category.find({ _id: id })
//         console.log(categories);
//         const result = await category.deleteOne({ _id: id });
//         console.log(result.deletedCount);
//         if (result.deletedCount == 1) {
//             res.json({ succes: 'category deleted succesfully..' })
//         }
//     } catch (err) {
//         res.json({ failure: 'Oops...Something went wrong..' })
//     }
// }
// module.exports.product_delete = async (req, res) => {
//     console.log(req.body);
//     const id = req.body.id
//     try {
//         const productdetails = await product.find({ _id: id })
//         console.log(productdetails);
//         const result = await product.deleteOne({ _id: id });
//         console.log(result.deletedCount);
//         if (result.deletedCount == 1) {
//             res.json({ succes: 'category deleted succesfully..' })
//         }
//     } catch (err) {
//         res.json({ failure: 'Oops...Something went wrong..' })
//     }
// }
// module.exports.addtocart_post = async (req, res) => {
//     const { owner, product, quantity, size } = await req.body
//     console.log(req.body)
//     const totalcost = cost * quantity
//     const newproduct = new cart({
//         product: product,
//         cost: cost,
//         size: size,
//         totalcost: totalcost
//     })
//     const result = await newproduct.save(err => {
//         if (err) {
//             console.log('hello again cannot enter new products - error.........');
//             console.log(err)
//             res.json({ failure: 'something wrong...' })
//         } else {
//             console.log('product entered succesfullly..')
//             res.json({ succes: 'product entered...' })
//         }
//     })
// }
// module.exports.coupons_get = async (req, res) => {
//     console.log("coupons page...")
//     const coupons = await coupon.find()
//     res.render('coupons', { coupons })
// }
// module.exports.addcoupon_post = async (req, res) => {
//     const { couponcode, discount, date } = await req.body
//     console.log(req.body)
//     const newcoupon = new coupon({
//         code: couponcode,
//         discount: discount,
//         expiryDate: date
//     })
//     const result = await newcoupon.save(err => {
//         if (err) {
//             console.log('hello again cannot enter new coupons - error.........');
//             console.log(err)
//             res.json({ failure: 'something wrong...' })
//         } else {
//             console.log('coupon entered succesfullly..')
//             res.json({ succes: 'New coupon entered...' })
//         }
//     })
// }
// module.exports.orders_get = async (req, res) => {
//     console.log("orders page...")
//     const [coupons, orders] = await Promise.all([
//         coupon.find(),
//         order.find({})
//             .populate('user').sort({ createdAt: -1 })
//     ])
//     res.render('orders', { coupons, orders })
// }
// module.exports.order_delete = async (req, res) => {
//     console.log(req.body);
//     const orderid = req.body.orderid
//     try {
//         const result = await order.deleteOne({ _id: orderid });
//         if (result.deletedCount == 1) {
//             res.json({ succes: 'order deleted succesfully..' })
//         }
//     } catch (err) {
//         res.json({ failure: 'Oops...Something went wrong..' })
//     }
// }
// module.exports.editorder_get = async (req, res) => {
//     console.log("orderdetails-admin page...")
//     const orderid = req.query.orderid
//     console.log(orderid)
//     try {
//         const [coupons, orderdetails] = await Promise.all([
//             coupon.find(),
//             order.findOne({ _id: orderid })
//                 .populate('user')
//                 .populate('items.product')
//         ])
//         console.log(orderdetails)
//         res.render('orderdetails-admin', { coupons, orderdetails })
//     } catch (error) {
//         console.log(error)
//     }
// }
// module.exports.updatestatus_post = async (req, res) => {
//     // const orderid = req.query.orderid
//     const { newstatus, orderid } = req.body
//     console.log(req.body)
//     try {
//         let result = ''
//         let deliverydate = null
//         if (newstatus == 'Delivered') {
//             deliverydate = new Date()
//             result = await order.updateOne({ _id: orderid }, { $set: { status: newstatus, delivery: deliverydate } })
//         } else {
//             result = await order.updateOne({ _id: orderid }, { $set: { status: newstatus} })
//         }
//         console.log(result)
//         if (result.modifiedCount == 1) {
//             res.json({ succes: 'Status updated succesfully ...' })
//         } else {
//             res.json({ failure: 'Oops something went wrong ...' })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

