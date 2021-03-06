var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var router = express.Router();

// Set Storage Engine
	const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
	cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 5000000}, //5MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

/* GET uploadImage Page. */
router.get('/', (req, res) => res.render('uploadImage'));

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('uploadImage', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('uploadImage', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('uploadImage', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

module.exports = router;