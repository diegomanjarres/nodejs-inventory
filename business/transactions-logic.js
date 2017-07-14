const Transaction = require('../models/transaction')
const ItemsLogic = require('./items-logic')
const CostLogic = require('./cost-logic.js')
const ChainLogic = require('./chain-logic.js')
const ObjectID = require('mongodb')
  .ObjectID

let saveTransaction = (transaction, cb) => {
  return new Transaction(transaction)
    .save(cb)
}

let getTransactions = (query) => (Transaction.find(query))

let removeTransaction = Transaction.remove.bind(Transaction)

let transform = (userID, transformation) => {
  let { inputItems, outputItemID, quantity } = transformation
  let inputItemsIDs = inputItems.map(i => new ObjectID(i.item))
  let itemsQuery = {
    user: userID,
    _id: {
      $in: inputItemsIDs.concat(new ObjectID(outputItemID))
    }
  }
  let cost = CostLogic.getTransformationCost(transformation)
  ItemsLogic.getItems(itemsQuery)
    .then((items) => {
      let outputItem = items.find(i => i._id.equals(outputItemID))
      let OutputItemTransaction = createOutputItemTransaction(
        outputItem._id, quantity,
        cost, userID)
      let inputItemsTransactions = inputItems.map(i => {
        return createInputItemtTransaction(i.item, -1 *
          i.quantity * quantity, userID)
      })
      return saveMultipleTransactions([inputItemsTransactions, ...OutputItemTransaction])
    })
}

let saveMultipleTransactions = (transactions) => {
  return Transaction.collection.insert(transactions)
}

let getTransactionsOfItems = (userID, itemsIDs) => {
  let transactionsQuery = {
    user: userID,
    item: {
      $in: itemsIDs
    }
  }
  return getTransactions(transactionsQuery)
}

let createOutputItemTransaction = (itemId, quantity, cost,
  user) => {
  return {
    item: itemId,
    date: new Date(),
    quantity: quantity,
    description: 'Producto Procesado',
    type: 'processedItem',
    user: user,
    unitPrice: cost
  }
}

let createInputItemtTransaction = (itemId, quantity, user) => {
  return {
    item: itemId,
    date: new Date(),
    quantity: quantity,
    description: 'Producto Procesado',
    type: 'processedItemIngredient',
    user: user
  }
}

let transferStock = (itemID, senderUserID, recipientUserID, quantity) => {
  ChainLogic.getChain(senderUserID, recipientUserID)
    .then((chain) => {
      if (!chain) throw new Error('not partners')
      let fromTransaction = {
        item: itemID,
        date: new Date(),
        quantity: quantity,
        description: 'Transferencia de Producto',
        type: 'transfer',
        user: senderUserID
      }
      let toTransaction = {
        item: itemID,
        date: new Date(),
        quantity: quantity,
        description: 'Transferencia de Producto',
        type: 'transfer',
        user: recipientUserID
      }
      return saveMultipleTransactions([fromTransaction, toTransaction])

    })

}

module.exports = {
  saveTransaction,
  getTransactions,
  removeTransaction,
  transform,
  saveMultipleTransactions,
  getTransactionsOfItems,
  transferStock,
}
