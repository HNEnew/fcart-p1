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

    // handle errors
const handleErrors = (err) => {
    console.log(err.message , err.code)
    let errors = { uname: '' , email: '' , password: '' , phone: '' }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            
            errors[properties.path] = properties.message
        })
    } else if (err.code == 11000){
        errors.email = 'An account already exists with this mail id...'
    }
    return errors
}

module.exports.login_get = (req, res) => {
    res.render('userlogin')
}
module.exports.otp_get = async (req, res) => {
    const token = req.cookies.usertoken
    
    let userdata
    if(token) {
        const decoded = jwt.verify(token, "mysecretkey");
        email = decoded.userid
        userdata = await user.findOne({email})
    }
    res.render('otp', {phone: userdata.phone})
}


module.exports.login_post = async (req, res, next) => {
    const { email, password } = await req.body
    
    const usercheck = await user.findOne({ email })
    
    if (!usercheck) {
        
        res.json({ message: 'invalid email or password' })
    } else {
        
        req.userphone = usercheck.phone
        
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
            const errors = handleErrors(err)
            console.log(errors)
            console.log(err.code);
            res.json({ failure: errors })
        } else {
            
            res.json({ succes: 'Account registered succesfully..' })
        }
    })
}
module.exports.home_get = async (req, res) => {
    try {
        const userdata = req.userdata
        const [categories, products] = await Promise.all([
            category.find({}),
            product.find({deleted: false}).sort({createdAt: -1})
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
        
        const limit = 8
        const count = await product.countDocuments({ category: categoryname })
        
        let totalpages = Math.ceil(count / limit)
        
        const categorycollection = await product.find({ category: categoryname , deleted: false})
            .skip((page - 1) * limit)
            .limit(limit)
        
        const userdata = req.userdata
        res.render('categorycollection', { categories, categoryid, categoryname, categorycollection, userdata, totalpages, page, cartquantity: req.cartquantity })
    } catch (err) {
        console.log(err);
    }
}
module.exports.searchresult_get = async (req, res) => {
    try {
        const text = req.query.text
        
        const result = await product.find({$or : [ { name: { $regex: text } } , { category: { $regex: text } } ] });
        
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
                address.find({ user: userdata._id }),
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

module.exports.pageunderconstruction_get = (req, res) => {
    try {
        res.render('construction')
    } catch (error) {
        console.log(error)
    }
}




