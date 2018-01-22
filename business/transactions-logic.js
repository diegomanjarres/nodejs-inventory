const Transaction = require('../models/transaction')
var Q = require('q')
const ObjectID = require('mongodb')
  .ObjectID

function TransactionsLogic(ItemsLogic) {
  var monitor
  let startMonitor = (monitorInstance) => {
    monitor = monitorInstance
  }
  let stopMonitor = () => {
    monitor = null
  }
  let saveTransaction = (transaction, cb) => {
    if (monitor && transaction.quantity < 0) monitor.check(transaction)
    if (!transaction.date) transaction.date = new Date()
    return new Transaction(transaction)
      .save(cb)
  }

  let saveMultipleTransactions = (transactions) => {
    transactions.forEach(transaction => {
      if (monitor && transaction.quantity < 0) monitor.check(transaction)
    })
    return Transaction.collection.insert(transactions)
  }

  let getTransactions = (query) => (Transaction.find(query))

  let removeTransaction = (query) => (Transaction.remove(query))

  let transform = (userID, transformation) => {
    let {
      inputItems,
      outputItemID,
      quantity
    } = transformation
    let inputItemsIDs = inputItems.map(i => new ObjectID(i.item))
    let itemsQuery = {
      user: userID,
      _id: {
        $in: inputItemsIDs.concat(new ObjectID(outputItemID))
      }
    }
    let cost = getTransformationCost(transformation)
    let promise = ItemsLogic.getItems(itemsQuery)
      .then((items) => {
        let outputItem = items.find(i => i._id.equals(outputItemID))
        let outputItemTransaction = createOutputItemTransaction(
          outputItem._id, quantity,
          cost, userID)
        let inputItemsTransactions = inputItems.map(i => {
          return createInputItemtTransaction(i.item, -1 *
            i.quantity * quantity, userID)
        })
        return saveMultipleTransactions([...inputItemsTransactions, outputItemTransaction])
      })
    return promise
  }

  // TODO: check function and decide where to place this logic
  function getTransformationCost(transformation) {
    let {
      inputItems
    } = transformation
    let promises = inputItems.map((item) => {
      let deferred = Q.defer()
      ItemsLogic.getItems({id: item._id})
        .then(item => {
          deferred.resolve(item.price * item.quantity)
        })
      return deferred.promise
    })
    Q.all(promises)
      .done(values => {
        return Q(values.reduce((m, i) => (m + i), 0))
      })
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

  return {
    startMonitor,
    stopMonitor,
    saveTransaction,
    getTransactions,
    removeTransaction,
    transform,
    saveMultipleTransactions,
    getTransactionsOfItems
  }
}
module.exports = TransactionsLogic
