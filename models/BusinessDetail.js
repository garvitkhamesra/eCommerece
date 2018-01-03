var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BusinessDetailSchema = new Schema(
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
    Gstin: {
      type: String,
      required: [true, 'User gstin number required'],
      unique:[true, 'Number used already'],
      validate: {
            validator: function(value) {
              return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}/.test(value);
            },
            message: '{VALUE} is not a valid 15 digit gstin number!'
      }
    },
    Tan: {
      type: String,
      required: [true, 'User tan number required'],
      unique:[true, 'Number used already'],
      validate: {
            validator: function(value) {
              return /[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
            },
            message: '{VALUE} is not a valid 15 digit gstin number!'
      }
    },
    Address: {
      type: String,
      required: [true, 'User address required'],
    },
    Pin: {
      type: Number,
      required: [true, 'Pin-Code required']
    },
    City: {
      type: String,
      required: [true, 'City name required']
    },
    State: {
      type: String,
      required: [true, 'State name required']
    }
  }
);

//Export model
module.exports = mongoose.model('BusinessDetail', BusinessDetailSchema);
