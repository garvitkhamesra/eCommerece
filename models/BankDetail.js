var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BankDetailSchema = new Schema(
  {
    SellerId: {
      type: String,
      required: [true, 'User id required'],
      unique: [true, 'Already Added']
    },
    Name: {
      type: String,
      required: [true, 'User name required']
    },
    BankName: {
      type: String,
      required: [true, 'Bank name required']
    },
    Ifsc: {
      type: String,
      required: [true, 'ifsc required']
    },
    AccountNumber: {
      type: String,
      required: [true, 'Account Number Required'],
      unique: [true, 'Check the Acccount Number'],
      validate: {
            validator: function(value) {
              return /[0-9]{4}[0-9]{4}[0-9]{2}[0-9]{10}/.test(value);
            },
            message: '{VALUE} is not a valid account number!'
      }
    },
    Mobile: {
      type: Number,
      required: [true, 'User phone number required'],
      unique: true,
      validate: {
            validator: function(value) {
              return /d{10}/.test(value);
            },
            message: '{VALUE} is not a valid 10 digit number!'
      }
    }
  }
);

//Export model
module.exports = mongoose.model('BankDetail', BankDetailSchema);
