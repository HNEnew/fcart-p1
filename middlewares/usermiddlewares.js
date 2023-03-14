const user = require('../models/usersmodel')
const jwt = require('jsonwebtoken');
const address = require('../models/address')
// middleware to check user token:

module.exports.check_token = async (req,res,next) => {
    const token = req.cookies.usertoken
    // console.log(token)
    if(token) {
        const decoded = jwt.verify(token, "mysecretkey");
        email = decoded.userid
        const userdata = await user.findOne({email})
        req.userdata = userdata
        console.log('user have token ..')
        next()
    }else{
        console.log('user have no token...')
        next()
    }
}

