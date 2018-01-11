var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemsSchema = new Schema(
  {
    SellerId: {
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
    AvailablityStatus: {
      type: Boolean,
      required: [true, 'Status required']
    },
    Stock: {
      type: Number,
      required: [true, 'Stock Required'],
    },
    Category: {
      type: String,
      required: [true, 'category required']
    },
    Description: {
      type: String,
      required: [true, 'tell something about product']
    },
    Image: {
      type: String,
      required: [true, 'product image is required']
    }
  }
);

//Export model
module.exports = mongoose.model('Items', ItemsSchema);
