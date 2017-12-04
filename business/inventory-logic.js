const Cache = require('../cache')
const Q = require('q')

function InventoryLogic(TransactionsLogic, OrdersLogic) {
  let quantityIn = (query) => {
    return TransactionsLogic.getTransactions(query)
      .then((transactions) => {
        let qtyIn = calculateActivity(transactions, 'in')
        return Q(qtyIn)
      })
      .catch(e => {
        throw new Error(e)
      })
  }
  let quantityOut = (query) => {
    return TransactionsLogic.getTransactions(query)
      .then((transactions) => {
        let qtyOut = calculateActivity(transactions, 'out')
        return Q(qtyOut)
      })
      .catch(e => {
        throw new Error(e)
      })
  }

  let getItemStockLevel = (query) => {
    let date = query.date ? new Date(query.date) : new Date()
    let stockLevel = 0
    let item = query.item
    let user = query.user
    query.date = {
      $lte: date
    }
    return Cache.getClosestPreviousStockRecord(query)
      .then(cachedValue => {
        if (cachedValue) {
          query.date.$gt = cachedValue.date
          stockLevel = cachedValue.stockLevel
        }
        return TransactionsLogic.getTransactions(query)
      })
      .catch(() => (TransactionsLogic.getTransactions(query)))
      .then(transactions => {
        transactions.forEach(transaction => {
          stockLevel += transaction.quantity
        })
        Cache.insertStockRecord({
          date,
          stockLevel,
          user,
          item
        })
        return Q(stockLevel)
      })
  }

  let getItemStockPosition = (query) => {
    let date = query.date ? new Date(query.date) : new Date()
    let stockLevel
    return getItemStockLevel(query)
      .then((_stockLevel) => {
        stockLevel = _stockLevel
        return OrdersLogic.getItemsActiveOrders(query.user, [query.item], date)
      })
      .then((activeOrders) => {
        let incomingQuantity = activeOrders.reduce((memo, act) => {
          return memo + act.transaction.quantity
        }, 0)
        return Q(stockLevel + incomingQuantity)
      })
  }

  let calculateActivity = (transactions, type) => {
    return transactions.reduce((q, t) => {
      if (type === 'out' && t.quantity < 0) return q - t.quantity
      if (type === 'in' && t.quantity > 0) return q + t.quantity
      else if (type === 'all') return q + t.quantity
      else return q
    }, 0)
  }
  return {
    getItemStockLevel,
    getItemStockPosition,
    quantityIn,
    quantityOut
  }
}
module.exports = InventoryLogic
