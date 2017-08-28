const Transactions = require('./business/transactions-logic')
const Items = require('./business/items-logic.js')
const ItemsRoutes = require('./routes/items.js')
const TransactionsRoutes = require('./routes/transactions.js')
const InventoryRoutes = require('./routes/inventory.js')
const mongoose = require('mongoose')

const connect = mongoose.connect.bind(mongoose)

function Inventory(i, n) {
  this.n = n
  this.i = i

  let properties = {
    connect,
    Transactions,
    Items,
    ItemsRoutes,
    TransactionsRoutes,
    InventoryRoutes,
    allRoutes: [ItemsRoutes, TransactionsRoutes, InventoryRoutes]
  }

  Object.assign(this, properties)
}
module.exports = Inventory
