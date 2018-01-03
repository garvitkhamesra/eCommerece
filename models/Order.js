var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema(
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
    ItemName: {
      type: String,
      required: [true, 'Item name required']
    },
    Amount: {
      type: Number,
      required: [true, 'Amount required']
    },
    Status: {
      type: String,
      required: [true, 'Status required']
    },
    Address: {
      type: String,
      required: [true, 'Address Required'],
    }
  }
);

//Export model
module.exports = mongoose.model('Order', OrderSchema);
