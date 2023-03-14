var express = require('express');
var router = express.Router();
const usercontroller = require('../controllers/usercontroller')
const wishlistcontroller = require('../controllers/wishlistcontroller')
const cartcontroller = require('../controllers/cartcontroller')
const checkoutcontroller = require('../controllers/checkoutcontroller')
const ordercontroller = require('../controllers/ordercontroller')
const usermidware = require('../middlewares/usermiddlewares')
const otpverify = require('../middlewares/otpverify')
const addresscontroller = require('../controllers/addrescontroller')


/* GET login form. */
router.get('/login', usercontroller.login_get)

/* GET otp form. */
router.get('/otp', usercontroller.otp_get)

/* POST login form. */ 
// router.post('/login', usercontroller.login_post)
router.post('/login', usercontroller.login_post, otpverify.senduser_otp)

router.post('/verify', otpverify.verifyuserlogin_otp)

/* GET logout . */
router.get('/logout', usercontroller.logout_get)

/* GET signup form. */
router.get('/signup', usercontroller.signup_get)

/* POST signup form. */
router.post('/signup', usercontroller.signup_post)

/* GET home page. */
router.get('/', usermidware.check_token, usercontroller.home_get)

/* GET category collection. */
router.get('/categorycollection', usermidware.check_token, usercontroller.categorycollection_get)

/* GET productdetails. */
router.get('/productdetails', usermidware.check_token, usercontroller.productdetails_get)

/* GET about. */
router.get('/about', usermidware.check_token, usercontroller.about_get)

/* GET contact. */
router.get('/contact', usermidware.check_token, usercontroller.contact_get)

/* GET cart. */
router.get('/cart', usermidware.check_token, cartcontroller.cart_get)

/* GET userprofile. */
router.get('/userprofile', usermidware.check_token, usercontroller.userprofile_get)

/* POST addaddress. */
router.post('/addaddress', usermidware.check_token, addresscontroller.addaddress_post)

/* POST editaddress. */
router.post('/editaddress', usermidware.check_token, addresscontroller.editaddress_post)

/* POST addtocart. */
router.post('/addtocart', usermidware.check_token, cartcontroller.addtocart_post)

/* PUT quantityminus. */
router.put('/quantityminus', usermidware.check_token, cartcontroller.quantityminus_put)

/* PUT quantityplus. */
router.put('/quantityplus', usermidware.check_token, cartcontroller.quantityplus_put)

/* POST cancelitem. */
router.post('/cancelitem', usermidware.check_token, cartcontroller.cancelitem_post)

/* POST couponcheck. */
router.post('/couponcheck', usermidware.check_token, checkoutcontroller.couponcheck_post)

/* GET checkout. */
router.get('/checkout', usermidware.check_token, checkoutcontroller.checkout_get)

/* GET placeorder. */
router.post('/placeorder', usermidware.check_token, checkoutcontroller.placeorder_post)

/* GET placeorder. */
router.get('/ordercomplete', usermidware.check_token, ordercontroller.ordercomplete_get)

/* POST paypalgateway. */
router.post('/paypalpayment', usermidware.check_token, checkoutcontroller.paypalpayement_post)

/* GET orderhistory. */
router.get('/orderhistory', usermidware.check_token, ordercontroller.orderhistory_get)

/* GET invoice. */
router.get('/getinvoice', usermidware.check_token, ordercontroller.invoice_get)

/* GET wishlist. */
router.get('/wishlist', usermidware.check_token, wishlistcontroller.wishlist_get)

/* POST addtowishlist. */
router.post('/addtowishlist', usermidware.check_token, wishlistcontroller.addtowishlist_post)

/* PUT cancelorder. */
router.put('/cancelorder', usermidware.check_token, ordercontroller.cancelorder_put)

/* PUT returnproduct. */
router.put('/returnproduct', usermidware.check_token, ordercontroller.returnproduct_put)




module.exports = router;


