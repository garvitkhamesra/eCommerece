var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var session = require('express-session');
var mongoDB = 'mongodb://garvitkhamesra:mongodatabase@ds239047.mlab.com:39047/ecommerce-project';
var busboy = require('connect-busboy');
var BankDetail = require('../models/BankDetail');
var BusinessDetail = require('../models/BusinessDetail');
var CustomerLogin = require('../models/CustomerLoginDetails');
var Items = require('../models/Items');
var MyBag = require('../models/MyBag');
var Order = require('../models/Order');
var SellerLoginSchema = require('../models/SellerLoginDetail');
var Transaction = require('../models/Transactions');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', errors: []});
});
//
// router.get('/addProduct', checkSignIn, function(req, res, next) {
//   res.redirect('SellerIndex');
// });

router.get('/SellerLogin', function(req, res, next) {
  res.render('SellerLogin', { title: 'Express', errors: []});
});

router.get('/SellerIndex', checkSignIn, function(req, res, next) {
  Items.find({SellerId: req.session.email}, function(error, docs) {
    if (error) {
      error = "Not Loaded";
    }

    res.render('SellerIndex', { title: 'Express', errors: error, items: docs});
  });
});

function checkSignIn(req, res, next){
   if (req.session.email) {
     next();
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
                      req.session.email = req.body.EmailRegister;
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
                  req.session.email = req.body.EmailLogin;
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

router.post('/addProduct',[
  body('itemName', 'item name is required').isLength({ min: 1 }).trim(),
  body('modelName', 'model name required').isLength({ min: 1 }).trim(),
  body('brandName', 'brand name is required').isLength({ min: 1 }).trim(),
  body('amount', 'amount of product is required').isLength({ min: 1 }).trim(),
  body('stock', 'stock value is required').isLength({ min: 1 }).trim(),
  body('inputCategory', 'Select a category').isLength({ min: 1 }).trim(),
  body('description', 'product description is required').isLength({ min: 1 }).trim(),

  body('modelName', 'model name required').isAlphanumeric(),
  body('itemName', 'item name is required').isAlpha(),
  body('brandName', 'brand name is required').isAlpha(),
  body('amount', 'amount of product is required').isNumeric(),
  body('stock', 'stock value is required').isNumeric(),

  // Sanitize (trim and escape) the fields.
  sanitizeBody('itemName').trim().escape(),
  sanitizeBody('brandName').trim().escape(),
  sanitizeBody('modelName').trim().escape(),
  sanitizeBody('description').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages
          Items.find({SellerId: req.session.email}, function(error, docs) {
            if (error) {
              error = "Not Loaded";
            }
            errors.array().push(error);
            return res.render('SellerIndex', { title: 'Registeration', errors: errors.array(), items: docs});
          });
      }
      else {
          // Data from form is valid.
          var available = false;
          if(req.body.stock > 0){
            available = true;
          }
          var uploader = req.files.upload;
          var name = uploader.name.split('.');
          var length = uploader.name.split('.').length;
          var extension = name[length-1];
          var url = req.session.email+req.body.itemName+"."+extension;
          uploader.mv(__dirname + "/../public/itemsImages/" + url, function(error) {
            if (error) {
              console.log(error);
              return false;
            }
          });

          var Item = new Items(
            {
              ItemName: req.body.itemName,
              ModelName: req.body.modelName,
              BrandName: req.body.brandName,
              Amount: req.body.amount,
              Stock: req.body.stock,
              Category: req.body.inputCategory,
              Description: req.body.description,
              Image: url,
              SellerId: req.session.email,
              AvailablityStatus: available
            }
          );

          Item.save(function(error) {
            if (error) {
              console.log(error);
            }
            res.redirect('SellerIndex');
          });
      }
  }
]);
module.exports = router;
