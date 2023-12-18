// middleware to check admin token:

module.exports.check_token = (req,res,next) => {
    const iftoken = req.cookies.itsadmin
    
    if(iftoken) {
        
        next()
        
    }else{
       
        res.redirect('/admin/login')
    }
}

