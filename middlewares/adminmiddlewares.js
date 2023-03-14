// middleware to check admin token:

module.exports.check_token = (req,res,next) => {
    const iftoken = req.cookies.itsadmin
    console.log(iftoken)
    if(iftoken) {
        console.log('token exists..')
        next()
    }else{
        console.log('no token...')
        res.redirect('/admin/login')
    }
}

