var express = require('express');

var router = express.Router();

/* GET Home Page. */
router.get('/', (req, res) => res.render('user'));

module.exports = router;