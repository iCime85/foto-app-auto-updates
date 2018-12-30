var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var data = require('../data/data.json');

/* GET Home Page. */
router.get('/', (req, res) => res.render('index',{data:data}));

// POST data to dataTest.json
router.post('/send', (req,res) => {
    var file = './data/data.json';

    var avatar = req.body.avatar;
    var name = req.body.name;
    var lastname = req.body.lastname;
    var birthday = req.body.birthday;
    
    var obj = { avatar:'/img/avatar.jpg',name:name,lastname:lastname,birthday:birthday };

    // Write data to JSON file
    fs.readFile(file, (err, data) => {
        if (err && err.code === "ENOENT") {
            return fs.writeFile(file, JSON.stringify([obj]), error => console.error);
        }
        else if (err) {
            console.error(err);
        }    
        else {
            try {
                const fileData = JSON.parse(data);
                fileData.push(obj);
                return fs.writeFile(file, JSON.stringify(fileData), error => console.error)
            } catch(exception) {
                console.error(exception);
            }
        }
});
res.render('index', {data:data, msg:"New user added"});
})

module.exports = router;