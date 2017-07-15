/**
 * Created by daman on 12/1/2015.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var itemStockCacheSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
  date: Date,
  stockLevel: Number,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('ItemStockCache', itemStockCacheSchema)
