const fs = require('fs')
const multer = require('multer')

// middleware to upload multiple image files for products
const storages = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/productimages/')
    },
    filename: function (req, file, cb) {
        cb( null, file.originalname)
    }
})
const upload = multer({ storage: storages })

// middleware to upload multiple image files for category
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const categorypath = 'public/categoryimages'
        if (!fs.existsSync(categorypath)) {
                        fs.mkdirSync(categorypath)
             }
        cb(null, categorypath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const uploadcategory = multer({ storage: storage })
module.exports = { upload, uploadcategory }


 