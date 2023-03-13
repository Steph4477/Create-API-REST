const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "_" + file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
    callback(null, true)
  } else{
    callback(null, false)
  }
}

let upload = multer({ storage: storage, fileFilter: fileFilter})

module.exports = upload.single('image')