/**
 * Created by daman on 11/27/2015.
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let orderSchema = new Schema({
  transaction: Object,
  orderCost: Number,
  issueDate: Date,
  effectiveDate: Date,
  user: Object
})
module.exports = mongoose.model('Order', orderSchema)
