/**
 * Created by daman on 11/27/2015.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var transactionSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
  provider: Object,
  date: Date,
  quantity: Number,
  description: String,
  type: String,
  unitPrice: Number,
  invoiceNumber: String,
  user: Object
})
module.exports = mongoose.model('Transaction', transactionSchema)
