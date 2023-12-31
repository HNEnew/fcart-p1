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
    (process.env.PAYPAL_CLIENT_ID,process.env.PAYPAL_CLIENT_SECRET))


    module.exports.checkout_get = async (req, res) => {
        const userdata = req.userdata
        let couponcode = req.query.coupon
        if (!couponcode) {
            couponcode = false
        }
        console.log(couponcode)
        const [useraddress, coupondetails, cartdetails, categories] = await Promise.all([
            address.find({ user: userdata._id }),
            coupon.findOne({ code: couponcode }),
            cart.findOne({ owner: userdata._id })
                .populate('items.product'),
            category.find({})
        ]) 
        
        if (coupondetails) {
            
            if (coupondetails.usedusers.includes(userdata._id)) {
               
                res.render('checkout', { categories, userdata, useraddress, cartdetails, cartquantity: req.cartquantity })
            } else {
                res.render('checkout', { categories, userdata, useraddress, cartdetails, coupondetails, cartquantity: req.cartquantity })
                
            }
        } else {
            const coupondetails = false
            res.render('checkout', { categories, userdata, useraddress, cartdetails, coupondetails, cartquantity: req.cartquantity })
            
        }
    }
    module.exports.placeorder_post = async (req, res) => {
        
        const userdata = req.userdata
        const { paymentmethod, addressid, couponid } = req.body
        
        const cartdetails = await cart.findOne({ owner: userdata._id })
            .populate('items.product')
        
        let billingaddress =  await address.findOne({ user: userdata._id , _id: addressid})
        let coupondetails = ''
       
        let finalamount = cartdetails.cartTotal
        let discount = 0
        if (couponid) {
            coupondetails = await coupon.findOne({ _id: couponid })
            finalamount = cartdetails.cartTotal - Number(coupondetails.discount)
            discount = Number(coupondetails.discount)
        }
        
        // making a rendom orderid
        let min = 100000;
        let max = 999999;
        let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
        
        // ---------------------
        const neworder = new order({
            user: userdata._id,
            items: cartdetails.items,
            totalamount: cartdetails.cartTotal,
            coupon: { code: coupondetails.code, amount: discount },
            finalamount: finalamount,
            paymentmethod: paymentmethod,
            billingdetails: billingaddress,
            orderid: randomInt,
            status: 'Pending'
        })
        if (paymentmethod == 'COD') {
            try {
                const result = await neworder.save(err => {
                    if (err) {
                        res.json({ failure: 'Something error..Order not placed' })
                    } else {
                        res.json({ succes: 'New Order placed succesfully' })
                    }
                })
                const removeitemsfromcart = await cart.updateOne({ _id: cartdetails._id }, { $set: { items: [], cartTotal: 0 } })
                
            } catch (Error) {
                console.log(Error);
            }
        } else if (paymentmethod == 'wallet') {
            try {
                const result = await neworder.save(err => {
                    if (err) {
                        res.json({ failure: 'Something error..Order not placed' })
                    } else {
                        res.json({ succes: 'New Order placed succesfully' })
                    }
                })
                const removeitemsfromcart = await cart.updateOne({ _id: cartdetails._id }, { $set: { items: [], cartTotal: 0 } })
                const walletbalance = await user.updateOne({_id: userdata._id},{$inc: {wallet: -finalamount}})
                
            } catch (Error) {
                console.log(Error);
            }
        } else if (paymentmethod == 'paypal') {
            
            try {
                const result = await neworder.save(err => {
                    if (err) {
                        res.json({ failure: 'Something error..Order not placed' })
                    } else {
                        res.json({ succes: 'New Order placed succesfully' })
                    }
                })
                const removeitemsfromcart = await cart.updateOne({ _id: cartdetails._id }, { $set: { items: [], cartTotal: 0 } })
                
            } catch (e) {
                res.status(500).json({ error: e.message })
                console.log(e);
            }
        }
    }
    module.exports.paypalpayement_post = async (req, res) => {
        const userdata = req.userdata
        const { paymentmethod, addressid, couponid } = req.body
        const cartdetails = await cart.findOne({ owner: userdata._id })
            .populate('items.product')
        let coupondetails = ''
        let finalamount = cartdetails.cartTotal
        let discount = 0
        if (couponid) {
            coupondetails = await coupon.findOne({ _id: couponid })
            finalamount = cartdetails.cartTotal - Number(coupondetails.discount)
            discount = Number(coupondetails.discount)
        }
        try {
            
            
            const request = new paypal.orders.OrdersCreateRequest()
            const total = finalamount
           
            request.prefer('return=representation')
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: total,
                        }
                    }
                ]
            })
           
            const order = await paypalClient.execute(request)
            res.json({ succes: 'Payment succesful', id: order.result.id })
        } catch (e) {
            res.status(500).json({ error: e.message })
            console.log(e);
        }
    }
    module.exports.couponcheck_post = async (req, res) => {
        const { userid, couponcode } = req.body
        try {
            const [coupondetails , cartdetails] = await Promise.all([
                coupon.findOne({ code: couponcode }),
                cart.findOne({owner: req.userdata._id})
            ])
            const totalamount = cartdetails.cartTotal
            
            if (coupondetails) {
                if (coupondetails.usedusers.includes(userid)) {
                    res.json({ failure: 'Coupon not added ... This coupon is not valid..' })
                } else if (coupondetails.minimumpurchase > totalamount) {
                    res.json({ failure: 'Coupon not added ... You have to purchase a minimum amount to apply this coupon..' })
                }else {
                    res.json({ succes: 'coupon added succesfully', coupondetails,totalamount })
                }
            } else {
                res.json({ failure: 'Coupon not added ... This coupon is not valid..' })
            }
        } catch (Error) {
            console.log(Error);
        }
    }
    module.exports.deleteaddress_delete = async (req, res) => {
        const addressid = req.body.id
        const userdata = req.userdata
        
        try {
            const result = await address.deleteOne({_id: addressid })
            
            if (result.deletedCount==1) {
                res.json({ succes: 'address deleted succesfully'})
            } else {
                res.json({ failure: 'Oops...Something went wrong...' })
            }
        } catch (error) {
            console.log(error)
        }
    }
