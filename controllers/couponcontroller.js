const coupon = require('../models/coupon')


module.exports.coupons_get = async (req, res) => {
    console.log("coupons page...")
    const coupons = await coupon.find()
    res.render('coupons', { coupons })
}
module.exports.addcoupon_post = async (req, res) => {
    const { couponcode, discount, date } = await req.body
    console.log(req.body)
    const newcoupon = new coupon({
        code: couponcode,
        discount: discount,
        expiryDate: date
    })
    const result = await newcoupon.save(err => {
        if (err) {
            console.log('hello again cannot enter new coupons - error.........');
            console.log(err)
            res.json({ failure: 'something wrong...' })
        } else {
            console.log('coupon entered succesfullly..')
            res.json({ succes: 'New coupon entered...' })
        }
    })
}