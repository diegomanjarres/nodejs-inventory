const Order = require('../models/order')
const TransactionsLogic = require('./transactions-logic')
const ObjectID = require('mongodb')
  .ObjectID

let saveOrder = (order) => {
  return new Order(order)
    .save()
}

let getOrders = (query) => (Order.find(query))

let removeOrder = (query) => (Order.remove(query))

let makeOrderEffective = (userId, orderId) => {
  return Order.findOneAndUpdate({ user: new ObjectID(userId), '_id': new ObjectID(orderId) }, { $set: { 'effectiveDate': new Date() } })
    .then(order => {
      return TransactionsLogic.saveTransaction(order.transaction)
    })
}

module.exports = {
  saveOrder,
  getOrders,
  removeOrder,
  makeOrderEffective
}
