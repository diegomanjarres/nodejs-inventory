const InventoryLogic = require('./inventory-logic')
let monitor = (transactions) => {
  transactions.forEach((transaction) => {
    InventoryLogic.getItemStock(transaction.item)
      .then()
  })
}

module.exports.monitor = monitor
