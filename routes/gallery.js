var express = require('express');
var path = require('path');
var fs = require('fs');

var router = express.Router();

// GET Gallery Page
router.get('/', (req, res) => {
  let images = getImagesFromDir(path.join(__dirname, '../public/uploads'));
  res.render('gallery', { images: images })
});

// dirPath: target image directory
function getImagesFromDir(dirPath) {

  // All iamges holder, defalut value is empty
  let allImages = [];

  // Iterator over the directory
  let files = fs.readdirSync(dirPath);

  // Iterator over the files and push jpg and png images to allImages array.
  for (file of files) {
      let fileLocation = path.join(dirPath, file);
      var stat = fs.statSync(fileLocation);		
      if (stat && stat.isDirectory()) {
          getImagesFromDir(fileLocation); // process sub directories
      } else if (stat && stat.isFile() && ['.jpeg', '.jpg', '.JPG', '.png'].indexOf(path.extname(fileLocation)) != -1) {
          allImages.push({path: 'uploads/'+file, lastModifiedDate:stat.mtime}); // push all .jpf and .png files to all images 
      }
  }

  // return all images in array formate
  return allImages;
}

module.exports = router;