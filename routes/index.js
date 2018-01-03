var express = require('express');
var router = express.Router();
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
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
  res.redirect('SellerLogin', { title: 'Express', errors: []});
});


router.get('/SellerLogin', function(req, res, next) {
  res.render('SellerLogin', { title: 'Express', errors: []});
});

router.post('/SellerLogin', [
    // Validate that the fields are not empty.
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


            SellerLoginSchema.save(SellerLogin, (error, user) => {
                console.log(user);
            });

            // SellerLoginSchema.save(function (err) {
            //   if (err) {
            //     return next(err);
            //   }
            //    res.redirect('/SellerIndex');
            // });
            // SellerLoginSchema.findOne({ 'Email': req.body.EmailRegister })
            //     .exec( function(err, email) {
            //          if (err) { return next(err); }
            //
            //          if (email) {
            //              res.redirect('SellerLogin');
            //          }
            //          else {
            //              SellerLogin.save(function (err) {
            //                if (err) {
            //                  return next(err);
            //                }
            //                res.redirect('/SellerIndex');
            //              });
            //          }
            //      });
        }
    }
]);
module.exports = router;
