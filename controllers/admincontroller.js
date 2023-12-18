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
const secretkey = process.env.SECRET_KEY

const Ademail = process.env.ADM_EMAIL
const Adpassword = process.env.ADM_PASSWORD

module.exports.login_get = function (req, res, next) {
    
    res.render('adminlogin')
}
module.exports.login_post = async function (req, res) {
    const { email, password } = req.body
    try {
        console.log('email & password rcvd ...')
        if (email == Ademail && password == Adpassword) {
            const token = await jwt.sign(payload, secretkey)
           
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
        
        res.json({ sales, profit, date })
    } catch (error) {
        console.log(error)
    }
}

module.exports.allsales_get = async (req, res) => {
    try {
        const salesdetails = await order.find({ status: 'Delivered' }).populate('items.product').populate('user').sort({ createdAt: -1 })
        
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
    
    const id = req.body.id
    try {
        const userdetails = await user.find({ _id: id })
        
        const result = await user.updateOne({ _id: id }, { $set: { status: false } });
       
        if (result.modifiedCount == 1) {
            res.json({ succes: 'user blocked..' })
        }
    } catch (err) {
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}
module.exports.userunblock_post = async (req, res) => {
    
    const id = req.body.id
    try {
        const userdetails = await user.find({ _id: id })
       
        const result = await user.updateOne({ _id: id }, { $set: { status: true } });
        
        if (result.modifiedCount == 1) {
            res.json({ succes: 'user Unblocked..' })
        }
    } catch (err) {
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}


