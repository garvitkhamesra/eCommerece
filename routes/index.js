var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var session = require('express-session');
var mongoDB = 'mongodb://garvitkhamesra:mongodatabase@ds239047.mlab.com:39047/ecommerce-project';

var BankDetail = require('../models/BankDetail');
var BusinessDetail = require('../models/BusinessDetail');
var CustomerLogin = require('../models/CustomerLoginDetails');
var Items = require('../models/Items');
var MyBag = require('../models/MyBag');
var Order = require('../models/Order');
var SellerLoginSchema = require('../models/SellerLoginDetail');
var Transaction = require('../models/Transactions');

mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('SellerLogin', { title: 'Express', errors: []});
});

router.get('/SellerLogin', function(req, res, next) {
  res.render('SellerLogin', { title: 'Express', errors: []});
});

router.get('/SellerIndex', checkSignIn,function(req, res, next) {
  res.render('SellerIndex', { title: 'Express'});
});

function checkSignIn(req, res){
   if (req.session.email) {
     return res.render('SellerIndex', { title: 'Express'});
   }
   else {
     var err = [];
     err.push("Not Logged In");
     return res.render('SellerLogin', { title: 'Express', errors: err});
   }
}

router.post('/SellerLogin', [
    // Validate that the fields are not empty and input values are valid or not.
    body('NameRegister', 'Seller name required').isLength({ min: 1 }).trim(),
    body('EmailRegister', 'Email Address required').isLength({ min: 1 }).trim(),
    body('MobileNumber', 'Mobile Number required').isLength({ min: 1 }).trim(),
    body('PasswordRegister', 'Password required').isLength({ min: 1 }).trim(),
    body('NameRegister', 'Only letters are allowed in name').isAlpha(),
    body('EmailRegister', 'Email Address is invalid').isEmail(),
    body('MobileNumber', 'Mobile Number is invalid').isMobilePhone("en-IN"),

    // Sanitize (trim and escape) the fields.
    sanitizeBody('NameRegister').trim().escape(),
    sanitizeBody('EmailRegister').trim().escape(),
    sanitizeBody('MobileNumber').trim().escape(),
    sanitizeBody('PasswordRegister').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a Seller object with escaped and trimmed data.
        var SellerLogin = new SellerLoginSchema(
          {
            Name: req.body.NameRegister,
            Mobile: req.body.MobileNumber,
            Email: req.body.EmailRegister,
            Password: req.body.PasswordRegister
          }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('SellerLogin', { title: 'Registeration', seller: SellerLogin, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            bcrypt.genSalt(10, function(err, salt) {
              if (err) return console.log(err);
              // hash the password along with our new salt
              bcrypt.hash(SellerLogin.Password, salt, function(err, hash) {
                  if (err) return console.log(err);
                  // override the cleartext password with the hashed one
                  SellerLogin.Password = hash;
                  SellerLogin.save(function (error) {
                    if (error) {
                      console.log(error);
                    }
                    else {
                      req.session.email = "SellerLogin.Email";
                      res.redirect('SellerIndex');
                    }
                  });
              });
            });
        }
    }
]);

router.post('/LoginSeller', [
    // Validate that the fields are not empty and input values are valid or not.
    body('EmailLogin', 'Email Address required').isLength({ min: 1 }).trim(),
    body('PasswordLogin', 'Password required').isLength({ min: 1 }).trim(),
    body('EmailLogin', 'Email Address is invalid').isEmail(),

    // Sanitize (trim and escape) the fields.
    sanitizeBody('EmailLogin').trim().escape(),
    sanitizeBody('PasswordLogin').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages
            return res.render('SellerLogin', { title: 'Registeration', errors: errors.array()});;
        }
        else {
            // Data from form is valid.
            SellerLoginSchema.findOne({ Email: req.body.EmailLogin }).exec(function (error, user) {
              var errArray = [];
              if (error) {
                return res.render('SellerLogin', { title: 'Registeration', errors: error});
              }
              else if (!user) {
                errArray.push('User not found.');
                return res.render('SellerLogin', { title: 'Registeration', errors: errArray});
              }
              bcrypt.compare(req.body.PasswordLogin, user.Password, function (err, result) {
                if (result === true) {
                  req.session.email = "req.body.EmailLogin";
                  return res.redirect('SellerIndex');
                }
                else {
                  errArray.push('Wrong Password');
                  return res.render('SellerLogin', { title: 'Registeration', errors: errArray});
                }
              });
            });
        }
    }
]);
module.exports = router;
