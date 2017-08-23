/**
 * Created by daman on 11/27/2015.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let transactionSchema = new Schema({
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

let orderSchema = new Schema({
  transactions: [transactionSchema],
  orderCost: Number,
  issueDate: Date,
  effectiveDate: Date,
  user: Object
})
module.exports = mongoose.model('Order', orderSchema)
