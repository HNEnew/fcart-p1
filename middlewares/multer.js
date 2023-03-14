const fs = require('fs')
const multer = require('multer')
// middleware to upload multiple image files

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = 'public/productimages/'
//         // if (!fs.existsSync(uploadPath)) {
//         //     fs.mkdirSync(uploadPath)
//         // }
//         cb(null, uploadPath)
//     },
//     filename: function (req, file, cb) {
        
//         console.log('inside multer...........');
//         console.log(file);
//         console.log('hello');
//         cb(file.originalname)
//         console.log('hello2');
//     }
// })


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
        cb(null, file.originalname)
    }
})
const uploadcategory = multer({ storage: storage })

module.exports = { upload, uploadcategory }


 