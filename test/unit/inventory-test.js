const assert = require('chai')
  .assert
const sinon = require('sinon')
const InventoryLogic = require('../../business/inventory-logic')
const TransactionsLogic = require('../../business/transactions-logic')
const Cache = require('../../cache')

var sandbox
beforeEach(function () {
  sandbox = sinon.sandbox.create()
})

afterEach(function () {
  sandbox.restore()
})

describe('inventory', function () {
  it('should calculate incoming quantity', function () {
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(getDummytransactions(10))

    return InventoryLogic.quantityIn()
      .then(qty => {
        assert.equal(qty, 25)
      })
  })

  it('should throw calculate incoming quantity error', function () {
    const errMsg = 'calculate incoming quantity error'
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .rejects(errMsg)

    return InventoryLogic.quantityIn()
      .then(qty => {
        assert.fail()
      })
      .catch(({ message }) => { assert.equal(message, errMsg) })
  })

  it('should calculate outgoing quantity', function () {
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(getDummytransactions(10))

    return InventoryLogic.quantityOut()
      .then(qty => {
        assert.equal(qty, 20)
      })
  })

  it('should throw calculate outgoing quantity error', function () {
    const errMsg = 'calculate incoming quantity error'
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .rejects(errMsg)

    return InventoryLogic.quantityOut()
      .then(qty => {
        assert.fail()
      })
      .catch(({ message }) => { assert.equal(message, errMsg) })
  })

  it('should throw calculate item stock with cached record', function () {
    const date = new Date()
    const stockLevel = 100
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .resolves({ date, stockLevel })
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(getDummytransactions(10))

    return InventoryLogic.getItemStock({date})
      .then(stockLevel => {
        assert.equal(stockLevel, 105)
      })
  })

  it('should throw calculate item stock without cached record', function () {
    const date = new Date()
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .resolves(null)
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(getDummytransactions(10))

    return InventoryLogic.getItemStock({date})
      .then(stockLevel => {
        assert.equal(stockLevel, 5)
      })
  })

  it('should throw calculate item stock even when cache fails', function () {
    const date = new Date()
    sandbox.stub(Cache, 'getClosestPreviousStockRecord')
      .rejects('error')
    sandbox.stub(Cache, 'insertStockRecord')
    sandbox.stub(TransactionsLogic, 'getTransactions')
      .resolves(getDummytransactions(10))

    return InventoryLogic.getItemStock({date})
      .then(stockLevel => {
        assert.equal(stockLevel, 5)
      })
  })
})

function getDummytransactions (n) {
  return [...Array(n).keys()]
    .map(k => ({ quantity: k % 2 ? k : -k }))
}
