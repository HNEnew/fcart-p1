const user = require('../models/usersmodel')
const jwt = require('jsonwebtoken');
const cart = require('../models/cart')
// middleware to check user token:

module.exports.check_token = async (req,res,next) => {
    const token = req.cookies.usertoken
    // console.log(token)
    if(token) {
        const decoded = jwt.verify(token, "mysecretkey");
        email = decoded.userid
        const userdata = await user.findOne({email})
        const cartitems = await cart.findOne({owner: userdata._id})
        let cartquantity = 0
        if (cartitems){
            if (cartitems.items){
                for (let i=0 ; i<cartitems.items.length ; i++) {
                    cartquantity += cartitems.items[i].quantity
                }
            }
        }
        console.log(cartquantity,'items...')
        req.cartquantity = cartquantity
        req.userdata = userdata
        console.log('user have token ..')
        next()
    }else{
        console.log('user have no token...')
        next()
    }
}

 