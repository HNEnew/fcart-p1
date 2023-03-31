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



module.exports.addaddress_post = async (req, res) => {
    const { userid, fname, lname, street, city, state, country, zip, email, phone } = req.body
    const useraddress = new address({
        user: userid,
        fname: fname,
        lname: lname,
        street: street,
        city: city,
        state: state,
        country: country,
        zip: zip,
        email: email,
        phone: phone
    })
    try {
        const result = await useraddress.save(err => {
            if (err) {
                res.json({ failure: 'Something error..Data not saved' })
            } else {
                res.json({ succes: 'Data saved succesfully' })
            }
        })
    } catch (Error) {
        console.log(Error);
    }
}
module.exports.editaddress_post = async (req, res) => {
    const { addressid, fname, lname, street, city, state, country, zip, email, phone } = req.body
    try {
        const result = await address.updateOne({ _id: addressid }, { $set: { fname: fname, lname: lname, street: street, city: city, state: state, country: country, zip: zip, email: email, phone: phone } })
        console.log(result)
        if (result.modifiedCount == 1) {
            res.json({ succes: 'Data updated succesfully' })
        } else {
            res.json({ failure: 'Something error..Data not saved' })
        }
    } catch (Error) {
        console.log(Error);
    }
}