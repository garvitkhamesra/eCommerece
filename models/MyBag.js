var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MyBagSchema = new Schema(
  {
    SellerId: {
      type: String,
      required: [true, 'Id required'],
    },
    CustomerId: {
      type: String,
      required: [true, 'Id required'],
    },
    ItemId: {
      type: String,
      required: [true, 'Id required'],
    },
    Cart: {
      type: Boolean,
      default: false
    }
  }
);

//Export model
module.exports = mongoose.model('MyBag', MyBagSchema);
