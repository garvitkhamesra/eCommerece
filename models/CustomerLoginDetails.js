var mongoose = require('mongoose');
var validatorModule = require('validator');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var CustomerLoginSchema = new Schema(
  {
    Name: {
      type: String,
      required: [true, 'Name is required'],
      validate: {
        validator: function (value) {
          return /[A-Za-z]+/.test(value);
        },
        message: '{VALUE} is not a valid name!'
      }
    },
    Mobile: {
      type: Number,
      required: [true, 'User phone number required'],
      unique: true,
      validate: {
            validator: function(value) {
              return /\d{10}/.test(value);
            },
            message: '{VALUE} is not a valid 10 digit number!'
      }
    },
    Email: {
      type: String,
      required: [true, 'User Email address required'],
      unique: true,
      validate: {
        validator: function (value) {
          return validatorModule.isEmail(value);;
        },
        message: '{VALUE} is not a valid Email address!'
      }
    },
    Password: {
      type: String,
      required: [true, 'User Password is required']
    }
  }
);

//Hasing Password before saving
CustomerLoginSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 15, function (error, hash) {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

//Export model
module.exports = mongoose.model('CustomerLogin', CustomerLoginSchema);
