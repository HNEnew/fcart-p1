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


module.exports.ordercomplete_get = async (req, res) => {
    try {
        const userdata = req.userdata
        const [categories, useraddress, cartdetails] = await Promise.all([
            category.find({}),
            address.findOne({ user: userdata._id }),
            cart.findOne({ owner: userdata._id })
                .populate('items.product')
        ])
        res.render('order-complete', { categories, userdata, useraddress, cartdetails, cartquantity: req.cartquantity })
    } catch (error) {
        console.log(error);
    }
}
module.exports.orderhistory_get = async (req, res) => {
    const userdata = req.userdata
    const [categories, useraddress, cartdetails, orders] = await Promise.all([
        category.find({}),
        address.findOne({ user: userdata._id }),
        cart.findOne({ owner: userdata._id })
            .populate('items.product'),
        order.aggregate([
            { $match: { user: userdata._id } },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'client' } },
            { $unwind: '$client' },
            { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'item' } }
        ]).sort({ createdAt: -1 })
    ])
    res.render('orderdetails-user', { categories, userdata, useraddress, cartdetails, orders, cartquantity: req.cartquantity })
}
module.exports.invoice_get = async (req, res) => {
    const userdata = req.userdata
    const orderid = req.query.orderid
    console.log(orderid)
    const [useraddress, orderdetails] = await Promise.all([
        address.findOne({ user: userdata._id }),
        order.findOne({ user: userdata._id, orderid: orderid }).populate('items.product').populate('user')
    ])
    console.log(orderdetails)
    res.render('invoice', { useraddress, orderdetails })
}
module.exports.cancelorder_put = async (req, res) => {
    const orderid = req.body.orderid
    const userdata = req.userdata
    console.log(req.body)
    try {
        const result = await order.updateOne({ orderid: orderid, user: userdata._id }, { $set: { status: 'Cancelled' } })
        console.log(result)
        if (result.modifiedCount == 1) {
            res.json({ succes: 'Order cancelled succesfully..' })
        } else {
            res.json({ failure: 'Oops something wrong..' })
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.returnproduct_put = async (req, res) => {
    const orderid = req.body.orderid
    const userdata = req.userdata
    console.log(req.body)
    try {
        const orderdetails = await order.findOne({ orderid: orderid, user: userdata._id })
        const timedifference = new Date().getTime() - orderdetails.delivery.getTime()
        const daysafterdelivery = Math.round(timedifference / (24 * 60 * 60 * 1000))
        if (daysafterdelivery <= 7) {
            console.log(orderdetails.finalamount)
            const [result, wallet] = await Promise.all([
                order.updateOne({ orderid: orderid, user: userdata._id }, { $set: { status: 'Returned' } }),
                user.updateOne({_id: userdata._id} , {$inc: {wallet: orderdetails.finalamount}})
            ])
            console.log(result)
            console.log(userdata._id)
            console.log(wallet)
            // const wallet = await user.updateOne({user: userdata._id} , {$set: {wallet: 0}})
            if (result.modifiedCount == 1) {
                res.json({ succes: 'Your request for return is accepted . Product return is in process.. The amount will be added to your wallet' })
            } else {
                res.json({ failure: 'Oops something wrong..' })
            }
        } else {
            res.json({ failure: 'Sorry..Product cannot return after 7 days..' })
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.updatestatus_post = async (req, res) => {
    const { newstatus, orderid } = req.body
    console.log(req.body)
    try {
        let result = ''
        let deliverydate = null
        if (newstatus == 'Delivered') {
            deliverydate = new Date()
            result = await order.updateOne({ _id: orderid }, { $set: { status: newstatus, delivery: deliverydate } })
        } else {
            result = await order.updateOne({ _id: orderid }, { $set: { status: newstatus } })
        }
        console.log(result)
        if (result.modifiedCount == 1) {
            res.json({ succes: 'Status updated succesfully ...' })
        } else {
            res.json({ failure: 'Oops something went wrong ...' })
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.order_delete = async (req, res) => {
    console.log(req.body);
    const orderid = req.body.orderid
    try {
        const result = await order.deleteOne({ _id: orderid });
        if (result.deletedCount == 1) {
            res.json({ succes: 'order deleted succesfully..' })
        }
    } catch (err) {
        res.json({ failure: 'Oops...Something went wrong..' })
    }
}
module.exports.editorder_get = async (req, res) => {
    console.log("orderdetails-admin page...")
    const orderid = req.query.orderid
    console.log(orderid)
    try {
        const [coupons, orderdetails] = await Promise.all([
            coupon.find(),
            order.findOne({ _id: orderid })
                .populate('user')
                .populate('items.product')
        ])
        console.log(orderdetails)
        res.render('orderdetails-admin', { coupons, orderdetails })
    } catch (error) {
        console.log(error)
    }
}
module.exports.orders_get = async (req, res) => {
    console.log("orders page...")
    const [coupons, orders] = await Promise.all([
        coupon.find(),
        order.find({})
            .populate('user').sort({ createdAt: -1 })
    ])
    res.render('orders', { coupons, orders })
}