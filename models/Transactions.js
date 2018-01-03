var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = new Schema(
  {
    SellerId: {
      type: String,
      required: [true, 'Id required'],
    },
    CustomerId: {
      type: String,
      required: [true, 'Id required'],
    },
    OrderId: {
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
    BrandName: {
      type: String,
      required: [true, 'Brand name required']
    },
    ModelName: {
      type: String,
      required: [true, 'Model name required']
    },
    Amount: {
      type: Number,
      required: [true, 'Amount required']
    },
    Date: {
      type: Number,
      required: [true, 'Amount required']
    }
  }
);

//Export model
module.exports = mongoose.model('Transaction', TransactionSchema);
