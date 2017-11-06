const assert = require('chai')
  .assert
const sinon = require('sinon')
const testId = global.testDate
const factory = require('../factory')
const TransactionsLogic = require('../../business/transactions-logic')()
const OrdersLogic = require('../../business/orders-logic')()
const InventoryLogic = require('../../business/inventory-logic')(TransactionsLogic, OrdersLogic)
const Cache = require('../../cache')

var sandbox
beforeEach(function() {
  sandbox = sinon.sandbox.create()
})

afterEach(function() {
  sandbox.restore()
})

describe('inventory', function() {
  it('should calculate incoming quantity', function() {
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(factory.getDummyTransactions('itemID', testId, 10))

    return InventoryLogic.quantityIn()
      .then(qty => {
        assert.equal(qty, 3000)
      })
  })

  it('should throw calculate incoming quantity error', function() {
    const errMsg = 'calculate incoming quantity error'
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .rejects(errMsg)

    return InventoryLogic.quantityIn()
      .then(qty => {
        assert.fail()
      })
      .catch(({ message }) => { assert.equal(message, errMsg) })
  })

  it('should calculate outgoing quantity', function() {
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(factory.getDummyTransactions('itemID', testId, 10))

    return InventoryLogic.quantityOut()
      .then(qty => {
        assert.equal(qty, 2500)
      })
  })

  it('should throw calculate outgoing quantity error', function() {
    const errMsg = 'calculate incoming quantity error'
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .rejects(errMsg)

    return InventoryLogic.quantityOut()
      .then(qty => {
        assert.fail()
      })
      .catch(({ message }) => { assert.equal(message, errMsg) })
  })

  it('should throw calculate item stock level cached record', function() {
    const date = new Date()
    const stockLevel = 100
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .resolves({ date, stockLevel })
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(factory.getDummyTransactions('itemID', testId, 10))

    return InventoryLogic.getItemStockLevel({ date })
      .then(stockLevel => {
        assert.equal(stockLevel, 600)
      })
  })

  it('should  calculate item stock level without cached record', function() {
    const date = new Date()
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .resolves(null)
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(factory.getDummyTransactions('itemID', testId, 10))

    return InventoryLogic.getItemStockLevel({ date })
      .then(stockLevel => {
        assert.equal(stockLevel, 500)
      })
  })

  it('should  calculate item stock level even when cache fails', function() {
    const date = new Date()
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .rejects('error')
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(factory.getDummyTransactions('itemID', testId, 10))

    return InventoryLogic.getItemStockLevel({ date })
      .then(stockLevel => {
        assert.equal(stockLevel, 500)
      })
  })

  it('should  calculate item stock position', function() {
    const date = new Date()
    const stockLevel = 100
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .resolves({ date, stockLevel })
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(factory.getDummyTransactions('itemID', testId, 10))
    sandbox.stub(OrdersLogic, 'getItemsActiveOrders')
      .resolves(factory.getDummyOrders('itemID', testId, 2))

    return InventoryLogic.getItemStockPosition({ date })
      .then(stockPosition => {
        assert.equal(stockPosition, 1200)
      })
  })
})
