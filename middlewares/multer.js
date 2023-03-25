const fs = require('fs')
const multer = require('multer')
// middleware to upload multiple image files

console.log('helllooo5555')
const storages = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/productimages/')
    },
    filename: function (req, file, cb) {
        cb( null, file.originalname)
    }
})
const upload = multer({ storage: storages })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const categorypath = 'public/categoryimages'
        if (!fs.existsSync(categorypath)) {
                        fs.mkdirSync(categorypath)
             }
        cb(null, categorypath)
    },
    filename: (req, file, cb) => {
        console.log('helllooo7777')
        cb(null, file.originalname)
        console.log('helllooo888')
    }
})
const uploadcategory = multer({ storage: storage })
console.log('multer.........')
module.exports = { upload, uploadcategory }


 