var express = require('express');
var path = require('path');
var ejs = require('ejs');

const PORT = process.env.PORT || 3000

var indexRouter = require('./routes/index');
var uploadImageRouter = require ('./routes/uploadImage');
var galleryRouter = require('./routes/gallery');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/uploadImage', uploadImageRouter);
app.use('/gallery', galleryRouter);
app.use('/user', userRouter);

module.exports = app;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));