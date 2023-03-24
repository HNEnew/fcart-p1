var express = require('express')
const user = require('../models/usersmodel')
const product = require('../models/product');
const category = require('../models/category');
const address = require('../models/address')
const cart = require('../models/cart')
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const coupon = require('../models/coupon');
const order = require('../models/order')
const paypal = require('@paypal/checkout-server-sdk');
const { LiveEnvironment } = require('@paypal/checkout-server-sdk/lib/core/lib');
require("dotenv").config()

const Environment = process.env.NODE_ENV === 'production'
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(new Environment
    (process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET))

module.exports.login_get = (req, res) => {
    res.render('userlogin')
}
module.exports.otp_get = (req, res) => {
    res.render('otp')
}


module.exports.login_post = async (req, res, next) => {
    const { email, password } = await req.body
    console.log(req.body)
    const usercheck = await user.findOne({ email })
    if (!usercheck) {
        console.log('no user found')
        res.json({ message: 'invalid email or password' })
    } else {
        console.log('user found : ' + usercheck)
        if (usercheck.status) {
            if (usercheck.password == password) {
                const payload = {
                    userid: email
                }
                const secretkey = 'mysecretkey'
                const token = await jwt.sign(payload, secretkey)
                res.cookie("usertoken", token, { httpOnly: true })
                res.json({ succes: 'authentication succes..' })
                next()
            } else {
                res.json({ message: 'invalid email or password' })
            }
        } else {
            res.json({ message: 'Sorry...Your account is blocked !' })
        }
    }
}

// 0000000000000000000000000000000000000000000000000000000000000000000000000
module.exports.logout_get = (req, res) => {
    res.clearCookie('usertoken')
    res.redirect('/')
}
module.exports.signup_get = (req, res) => {
    res.render('usersignup')
}
module.exports.signup_post = async (req, res) => {
    const { uname, email, phone, password } = req.body
    const newuser = new user({
        uname: uname,
        email: email,
        phone: phone,
        password: password
    })
    const result = await newuser.save(err => {
        if (err) {
            console.log(err)
        } else {
            console.log('user saved succesfully...')
            res.json({ succes: 'Account registered succesfully..' })
        }
    })
}
module.exports.home_get = async (req, res) => {
    try {
        const userdata = req.userdata
        const [categories, products] = await Promise.all([
            category.find({}),
            product.find({})
        ])
        res.render('userhome', { products, categories, userdata, cartquantity: req.cartquantity })
    } catch (error) {
        console.log(error);
    }
}
module.exports.categorycollection_get = async (req, res) => {
    try {
        let page = parseInt(req.query.page || 1)
        const categoryid = req.query.id
        const categories = await category.find({})
        const categorydoc = categories.find((doc) => doc._id == categoryid)
        let categoryname = ''
        if (categorydoc) {
            categoryname = categorydoc.name
        }
        console.log(page)
        const limit = 8
        const count = await product.countDocuments({ category: categoryname })
        console.log(count)
        let totalpages = Math.ceil(count / limit)
        console.log(totalpages)
        const categorycollection = await product.find({ category: categoryname })
            .skip((page - 1) * limit)
            .limit(limit)
        console.log(categorycollection)
        const userdata = req.userdata
        res.render('categorycollection', { categories, categoryid, categoryname, categorycollection, userdata, totalpages, page, cartquantity: req.cartquantity })
    } catch (err) {
        console.log(err);
    }
}
module.exports.searchresult_get = async (req, res) => {
    try {
        const text = req.query.text
        console.log(text)
        const result = await product.find({$or : [ { name: { $regex: text } } , { category: { $regex: text } } ] });
        console.log(result)
        res.json({result})
    } catch (error) {
        console.log(error)
    }

}
module.exports.productdetails_get = async (req, res) => {
    try {
        const userdata = req.userdata
        const productid = req.query.id
        const [categories, productdetails] = await Promise.all([
            category.find({}),
            product.findOne({ _id: productid })
        ])
        res.render('user-productdetails', { categories, productdetails, userdata, cartquantity: req.cartquantity })
    } catch (err) {
        console.log(err);
    }
}
module.exports.about_get = async (req, res) => {
    try {
        const categories = await category.find({})
        const userdata = req.userdata
        res.render('about', { categories, userdata, cartquantity: req.cartquantity })
    } catch (error) {
        console.log(error);
    }
}
module.exports.contact_get = async (req, res) => {
    try {
        const categories = await category.find({})
        const userdata = req.userdata
        res.render('contact', { categories, userdata, cartquantity: req.cartquantity })
    } catch (error) {
        console.log(error);
    }
}
module.exports.userprofile_get = async (req, res) => {
    try {
        const userdata = req.userdata
        if (userdata) {
            const [useraddress, categories] = await Promise.all([
                address.findOne({ user: userdata._id }),
                category.find({})
            ])
            res.render('userprofile', { categories, userdata, useraddress, cartquantity: req.cartquantity })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}





// module.exports.login_get = (req,res) => {}
