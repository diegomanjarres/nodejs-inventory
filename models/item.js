var mongoose = require('mongoose')
var Schema = mongoose.Schema

var itemSchema = new Schema({
  name: String,
  description: String,
  minStockReq: Number,
  optStock: Number,
  extIDs: Object,
  units: String,
  unitsType: String,
  category: String,
  lossCost: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Item', itemSchema)
