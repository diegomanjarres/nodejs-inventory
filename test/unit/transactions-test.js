const assert = require('chai')
  .assert
const sinon = require('sinon')
const ItemsLogic = require('../../business/items-logic')
const TransactionsLogic = require('../../business/transactions-logic')
const CostLogic = require('../../business/cost-logic')
const Transaction = require('../../models/transaction')
const ObjectId = require('mongoose')
  .Types
  .ObjectId

var sandbox
beforeEach(function () {
  sandbox = sinon.sandbox.create()
})

afterEach(function () {
  sandbox.restore()
})

describe('transactions', function () {
  it('should save a transaction', function () {
    var stub = sandbox.stub(Transaction.prototype, 'save')
      .resolves()

    return TransactionsLogic.saveTransaction({})
      .then(() => {
        assert(stub.called)
      })
  })

  it('should save multiple transactions', function () {
    var stub = sandbox.stub(Transaction.collection, 'insert')
      .resolves()

    return TransactionsLogic.saveMultipleTransactions([])
      .then(() => {
        assert(stub.called)
      })
  })

  it('should get all transactions', function () {
    var stub = sandbox.stub(Transaction, 'find')
      .resolves()

    return TransactionsLogic.getTransactions()
      .then(() => {
        assert(stub.called)
      })
  })

  it('should remove a transaction', function () {
    var stub = sandbox.stub(Transaction, 'remove')
      .resolves()

    return TransactionsLogic.removeTransaction()
      .then(() => {
        assert(stub.called)
      })
  })

  it('should transform itemsinto a product item', function () {
    const inputItems = getDummyInputItems(10)
    const outputItemID = new ObjectId('outputItemID')
    const _id = outputItemID
    const quantity = 123
    sandbox.stub(ItemsLogic, 'getItems')
      .resolves([{ _id }])
    sandbox.stub(CostLogic, 'getTransformationCost')
      .resolves(123)
    sandbox.stub(Transaction.collection, 'insert')
      .resolves('eexito')

    return TransactionsLogic.transform('userId', { inputItems, outputItemID, quantity })
      .then(console.log)
  })
})

function getDummyInputItems(n) {
  return [...Array(n)
      .keys()
    ]
    .map(k => ({ item: k, quantity: k % 2 ? k : -k }))
}
