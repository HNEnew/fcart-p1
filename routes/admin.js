
var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admincontroller') 
const adminmidware = require('../middlewares/adminmiddlewares')
const { upload , uploadcategory } = require('../middlewares/multer')
const ordercontroller = require('../controllers/ordercontroller')
const couponcontroller = require('../controllers/couponcontroller')
const categorycontroller = require('../controllers/categorycontroller')
const productcontroller = require('../controllers/productcontroller')
const heandleErrors = (err) => {
  console.log(err.message, err.code)
}

   
/* GET admin routes*/

router.get('/login', adminController.login_get)
router.post('/login', adminController.login_post)
router.get('/home', adminmidware.check_token, adminController.home_get)
router.get('/users', adminmidware.check_token, adminController.users_get)
router.get('/products', adminmidware.check_token, productcontroller.products_get)
router.get('/addproduct', adminmidware.check_token, productcontroller.addproducts_get)
router.post('/addproduct', adminmidware.check_token, upload.array('image',5), productcontroller.addproducts_post)
router.get('/productdetails', adminmidware.check_token, productcontroller.productdetails_get)
router.get('/editproduct', adminmidware.check_token, productcontroller.productedit_get)
router.get('/category', adminmidware.check_token, categorycontroller.category_get)
router.post('/editproduct', adminmidware.check_token, upload.array('image',5), productcontroller.editproducts_post)
router.get('/addcategory', adminmidware.check_token, categorycontroller.categoryadd_get)
router.post('/addcategory', adminmidware.check_token,uploadcategory.single('image') , categorycontroller.categoryadd_post)
router.delete('/deletecategory', adminmidware.check_token , categorycontroller.category_delete)
router.delete('/deleteproduct', adminmidware.check_token , productcontroller.product_delete)
router.post('/userblock', adminmidware.check_token, adminController.userblock_post)
router.post('/userunblock', adminmidware.check_token, adminController.userunblock_post)
// router.post('/addtocart', adminmidware.check_token, adminController.addtocart_post)
router.get('/coupons', adminmidware.check_token, couponcontroller.coupons_get)
router.post('/addcoupon', adminmidware.check_token, couponcontroller.addcoupon_post)
router.get('/orders', adminmidware.check_token, ordercontroller.orders_get)
router.delete('/deleteorder', adminmidware.check_token , ordercontroller.order_delete)  
router.get('/editorder', adminmidware.check_token, ordercontroller.editorder_get)
router.post('/updatestatus', adminmidware.check_token, ordercontroller.updatestatus_post)




router.get('/logout', function (req, res) {
  console.log("0000000000000011111")
  res.clearCookie('itsadmin')
    .redirect('/admin/login')
  console.log("0000000000000000000")    
})


 
   
// -----------------------------------------------------------


module.exports = router;


