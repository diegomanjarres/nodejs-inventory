const TransactionsLogic = require('./transactions-logic')
const ItemsLogic = require('./items-logic')
const CostLogic = require('./cost-logic.js')
const Cache = require('../cache')
const Q = require('q')

let quantityIn = (query) => {
  TransactionsLogic.getTransactions(query)
    .then((transactions) => {
      let qtyIn = calculateActivity(transactions, 'in')
      return Q(qtyIn)
    })
}
let quantityOut = (query) => {
  TransactionsLogic.getTransactions(query)
    .then((transactions) => {
      let qtyOut = calculateActivity(transactions, 'out')
      return Q(qtyOut)
    })
}

let getItemStock = (query) => {
  return 0;
}

let calculateActivity = function (transactions, type) {
  return transactions.reduce((q, t) => {
    if (type === 'out' && t.quantity < 0) return q - t.quantity
    if (type === 'in' && t.quantity > 0) return q + t.quantity
    else if (type === 'all') return q + t.quantity
    else return q
  }, 0)
}

module.exports = {
  quantityIn,
  quantityOut,
}
