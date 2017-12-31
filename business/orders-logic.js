const Order = require('../models/order')
const Q = require('q')
const ObjectID = require('mongodb')
  .ObjectID
module.exports = function OrdersLogic(TransactionsLogic) {
  let saveOrder = (order) => {
    return new Order(order)
      .save()
  }

  let getOrders = (query) => (Order.find(query))

  let removeOrder = (query) => (Order.remove(query))

  let makeOrderEffective = (userId, orderId) => {
    return Order.findOneAndUpdate({ user: userId, '_id': new ObjectID(orderId) }, { $set: { 'effectiveDate': new Date() } })
      .then(order => {
        return TransactionsLogic.saveTransaction(order.transaction)
      })
  }

  let getItemsActiveOrders = (userID, itemsIDs, date) => {
    let ordersQuerybyItemIdAndUser = {
      user: userID,
      'transaction.item': {
        $in: itemsIDs
      }
    }
    let activeOrdersQuery = {
      $or: [
        { effectiveDate: { $exists: false }, ...ordersQuerybyItemIdAndUser },
        { effectiveDate: { $gte: date }, ...ordersQuerybyItemIdAndUser }
      ]
    }
    return getOrders(activeOrdersQuery)
  }

  let getItemOrderCost = (userID, itemID, mode, params) => {
    let ordersQuery = {
      user: userID,
      'transaction.item': itemID
    }
    return getOrders(ordersQuery)
      .then((orders) => {
        return Q(orderCostModes[mode](orders, ...params))
      })
  }

  const orderCostModes = {
    lastOnly: (orders) => (orders.slice(-1)[0]),
    lastNAverage: (orders, n) => (
      orders.slice(-n).reduce((p, c) => p + c.orderCost, 0) / n
    )
  }

  return {
    saveOrder,
    getOrders,
    removeOrder,
    makeOrderEffective,
    getItemsActiveOrders,
    getItemOrderCost
  }
}
