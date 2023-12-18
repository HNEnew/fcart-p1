const coupon = require('../models/coupon')


module.exports.coupons_get = async (req, res) => {
    
    const coupons = await coupon.find()
    res.render('coupons', { coupons })
}
module.exports.addcoupon_post = async (req, res) => {
    const { couponcode, discount, date, minimumpurchase } = await req.body
    
    const newcoupon = new coupon({
        code: couponcode,
        discount: discount,
        expiryDate: date,
        minimumpurchase: minimumpurchase
    })
    const result = await newcoupon.save(err => {
        if (err) {
            
            console.log(err)
            res.json({ failure: 'something wrong...' })
        } else {
            
            res.json({ succes: 'New coupon entered...' })
        }
    })
}
module.exports.deletecoupon_delete = async (req, res) => {
    const couponid = req.body.couponid
    
    try {
        const result = await coupon.deleteOne({_id: couponid})
        
        if (result.deletedCount == 1) {
            res.json({succes : 'Coupon deleted..'})
        } else {
            res.json({failure : 'Oops something error..'})
        }
    } catch (error) {
        console.log(error)
    }
}
