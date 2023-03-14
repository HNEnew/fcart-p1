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
        res.render('userhome', { products, categories, userdata })
    } catch (error) {
        console.log(error);
    }
}
module.exports.categorycollection_get = async (req, res) => {
    try {
        const categoryid = req.query.id
        const categories = await category.find({})
        const categorydoc = categories.find((doc) => doc._id == categoryid)
        let categoryname = ''
        if (categorydoc) {
            categoryname = categorydoc.name
        }
        const categorycollection = await product.find({ category: categoryname })
        const userdata = req.userdata
        res.render('categorycollection', { categories, categoryname, categorycollection, userdata })
    } catch (err) {
        console.log(err);
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
        res.render('user-productdetails', { categories, productdetails, userdata })
    } catch (err) {
        console.log(err);
    }
}
module.exports.about_get = async (req, res) => {
    try {
        const categories = await category.find({})
        const userdata = req.userdata
        res.render('about', { categories, userdata })
    } catch (error) {
        console.log(error);
    }
}
module.exports.contact_get = async (req, res) => {
    try {
        const categories = await category.find({})
        const userdata = req.userdata
        res.render('contact', { categories, userdata })
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
            res.render('userprofile', { categories, userdata, useraddress })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}
// module.exports.addaddress_post = async (req, res) => {
//     const { userid, fname, lname, street, city, state, country, zip, email, phone } = req.body
//     const useraddress = new address({
//         user: userid,
//         fname: fname,
//         lname: lname,
//         street: street,
//         city: city,
//         state: state,
//         country: country,
//         zip: zip,
//         email: email,
//         phone: phone
//     })
//     try {
//         const result = await useraddress.save(err => {
//             if (err) {
//                 res.json({ failure: 'Something error..Data not saved' })
//             } else {
//                 res.json({ succes: 'Data saved succesfully' })
//             }
//         })
//     } catch (Error) {
//         console.log(Error);
//     }
// }
// module.exports.editaddress_post = async (req, res) => {
//     const { userid, fname, lname, street, city, state, country, zip, email, phone } = req.body
//     try {
//         const result = await address.updateMany({ user: userid }, { $set: { fname: fname, lname: lname, street: street, city: city, state: state, country: country, zip: zip, email: email, phone: phone } })
//         if (result.modifiedCount != 0) {
//             res.json({ succes: 'Data updated succesfully' })
//         } else {
//             res.json({ failure: 'Something error..Data not saved' })
//         }
//     } catch (Error) {
//         console.log(Error);
//     }
// }
// module.exports.couponcheck_post = async (req, res) => {
//     const { userid, couponcode } = req.body
//     try {
//         const coupondetails = await coupon.findOne({ code: couponcode })
//         if (coupondetails) {
//             if (coupondetails.usedusers.includes(userid)) {
//                 res.json({ failure: 'Coupon not added ... This coupon is not valid..' })
//             } else {
//                 res.json({ succes: 'coupon added succesfully', coupondetails })
//             }
//         } else {
//             res.json({ failure: 'Coupon not added ... This coupon is not valid..' })
//         }
//     } catch (Error) {
//         console.log(Error);
//     }
// }
// module.exports.checkout_get = async (req, res) => {
//     const categories = await category.find({})
//     const userdata = req.userdata
//     let couponcode = req.query.coupon
//     if (!couponcode) {
//         couponcode = false
//     }
//     console.log(couponcode)
//     const [useraddress, coupondetails, cartdetails] = await Promise.all([
//         address.find({ user: userdata._id }),
//         coupon.findOne({ code: couponcode }),
//         cart.findOne({ owner: userdata._id })
//             .populate('items.product')
//     ])
//     console.log(useraddress)
//     console.log(coupondetails)
//     if (coupondetails) {
//         console.log(coupondetails.usedusers.includes(userdata._id))
//         if (coupondetails.usedusers.includes(userdata._id)) {
//             console.log('1111111111111111111111')
//             res.render('checkout', { categories, userdata, useraddress, cartdetails })
//         } else {
//             res.render('checkout', { categories, userdata, useraddress, cartdetails, coupondetails })
//             console.log('2222222222222222222222')
//         }
//     } else {
//         const coupondetails = false
//         res.render('checkout', { categories, userdata, useraddress, cartdetails, coupondetails })
//         console.log('33333333333333333333333333')
//     }
// }
// module.exports.placeorder_post = async (req, res) => {
//     console.log('reached checkout')
//     const userdata = req.userdata
//     const { paymentmethod, addressid, couponid } = req.body
//     console.log(req.body)
//     const cartdetails = await cart.findOne({ owner: userdata._id })
//         .populate('items.product')
//     console.log('checking1')
//     let billingaddress =  await address.findOne({ user: userdata._id , _id: addressid})
//     let coupondetails = ''
//     console.log('checking2')
//     let finalamount = cartdetails.cartTotal
//     let discount = 0
//     if (couponid) {
//         coupondetails = await coupon.findOne({ _id: couponid })
//         finalamount = cartdetails.cartTotal - Number(coupondetails.discount)
//         discount = Number(coupondetails.discount)
//     }
//     console.log('checking3')
//     // making a rendom orderid
//     let min = 100000;
//     let max = 999999;
//     let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
//     console.log(randomInt);
//     // ---------------------
//     const neworder = new order({
//         user: userdata._id,
//         items: cartdetails.items,
//         totalamount: cartdetails.cartTotal,
//         coupon: { code: coupondetails.code, amount: discount },
//         finalamount: finalamount,
//         paymentmethod: paymentmethod,
//         billingdetails: billingaddress,
//         orderid: randomInt,
//         status: 'Pending'
//     })
//     if (paymentmethod == 'COD') {
//         try {
//             const result = await neworder.save(err => {
//                 if (err) {
//                     res.json({ failure: 'Something error..Order not placed' })
//                 } else {
//                     res.json({ succes: 'New Order placed succesfully' })
//                 }
//             })
//             const removeitemsfromcart = await cart.updateOne({ _id: cartdetails._id }, { $set: { items: [], cartTotal: 0 } })
//             console.log(removeitemsfromcart);
//         } catch (Error) {
//             console.log(Error);
//         }
//     } else if (paymentmethod == 'paypal') {
//         console.log('paypal order');
//         try {
//             const result = await neworder.save(err => {
//                 if (err) {
//                     res.json({ failure: 'Something error..Order not placed' })
//                 } else {
//                     res.json({ succes: 'New Order placed succesfully' })
//                 }
//             })
//             const removeitemsfromcart = await cart.updateOne({ _id: cartdetails._id }, { $set: { items: [], cartTotal: 0 } })
//             console.log(removeitemsfromcart);
//         } catch (e) {
//             res.status(500).json({ error: e.message })
//             console.log(e);
//         }
//     }
// }
// module.exports.paypalpayement_post = async (req, res) => {
//     const userdata = req.userdata
//     const { paymentmethod, addressid, couponid } = req.body
//     const cartdetails = await cart.findOne({ owner: userdata._id })
//         .populate('items.product')
//     let coupondetails = ''
//     let finalamount = cartdetails.cartTotal
//     let discount = 0
//     if (couponid) {
//         coupondetails = await coupon.findOne({ _id: couponid })
//         finalamount = cartdetails.cartTotal - Number(coupondetails.discount)
//         discount = Number(coupondetails.discount)
//     }
//     try {
//         console.log('paypaltransaction started');
//         const request = new paypal.orders.OrdersCreateRequest()
//         const total = finalamount
//         request.prefer('return=representation')
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [
//                 {
//                     amount: {
//                         currency_code: 'USD',
//                         value: total,
//                         breakdown: {
//                             item_total: {
//                                 currency_code: 'USD',
//                                 value: cartdetails.cartTotal
//                             },
//                             discount: {
//                                 currency_code: 'USD',
//                                 value: discount
//                             }
//                         }
//                     },
//                     items: cartdetails.items.map(item => {
//                         return {
//                             name: item.product.name,
//                             unit_amount: {
//                                 currency_code: 'USD',
//                                 value: item.product.cost
//                             },
//                             quantity: item.quantity
//                         }
//                     })
//                 }
//             ]
//         })
//         console.log('000000000000')
//         const order = await paypalClient.execute(request)
//         res.json({ succes: 'Payment succesful', id: order.result.id })
//     } catch (e) {
//         res.status(500).json({ error: e.message })
//         console.log(e);
//     }
// }
// module.exports.ordercomplete_get = async (req, res) => {
//     try {
//         const userdata = req.userdata
//         const [categories, useraddress, cartdetails] = await Promise.all([
//             category.find({}),
//             address.findOne({ user: userdata._id }),
//             cart.findOne({ owner: userdata._id })
//                 .populate('items.product')
//         ])
//         res.render('order-complete', { categories, userdata, useraddress, cartdetails })
//     } catch (error) {
//         console.log(error);
//     }
// }
// module.exports.orderhistory_get = async (req, res) => {
//     const userdata = req.userdata
//     const [categories, useraddress, cartdetails, orders] = await Promise.all([
//         category.find({}),
//         address.findOne({ user: userdata._id }),
//         cart.findOne({ owner: userdata._id })
//             .populate('items.product'),
//         order.aggregate([
//             { $match: { user: userdata._id } },
//             { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'client' } },
//             { $unwind: '$client' },
//             { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'item' } }
//         ]).sort({ createdAt: -1 })
//     ])
//     // console.log(orders)
//     // for(var i=0;i<orders.length;i++){
//     //     console.log(orders[i].delivery)
//     // }
//     res.render('orderdetails-user', { categories, userdata, useraddress, cartdetails, orders })
// }
// module.exports.invoice_get = async (req, res) => {
//     const userdata = req.userdata
//     const orderid = req.query.orderid
//     console.log(orderid)
//     const [useraddress, orders] = await Promise.all([
//         address.findOne({ user: userdata._id }),
//         order.aggregate([
//             { $match: { orderid: orderid } },
//             { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'client' } },
//             { $unwind: '$client' },
//             { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'item' } }
//         ])
//     ])
//     console.log(orders)
//     res.render('invoice', { useraddress, orders })
// }
// module.exports.cancelorder_put = async (req, res) => {
//     const orderid = req.body.orderid
//     const userdata = req.userdata
//     console.log(req.body)
//     try {
//         const result = await order.updateOne({ orderid: orderid, user: userdata._id }, { $set: { status: 'Cancelled' } })
//         console.log(result)
//         if (result.modifiedCount == 1){
//             res.json({ succes: 'Order cancelled succesfully..' })    
//         } else {
//             res.json({ failure: 'Oops something wrong..' })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
// module.exports.returnproduct_put = async (req, res) => {
//     const orderid = req.body.orderid
//     const userdata = req.userdata
//     console.log(req.body)
//     try {
//         const result = await order.updateOne({ orderid: orderid, user: userdata._id }, { $set: { status: 'Returned' } })
//         console.log(result)
//         if (result.modifiedCount == 1){
//             res.json({ succes: 'Product return in process..' })
//         } else {
//             res.json({ failure: 'Oops something wrong..' })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }





// module.exports.login_get = (req,res) => {}
