const assert = require('chai')
  .assert
const sinon = require('sinon')
const testId = global.testDate
const factory = require('../factory')
const Order = require('../../models/order')
const ItemsLogic = require('../../business/items-logic')()
const TransactionsLogic = require('../../business/transactions-logic')( ItemsLogic)
const OrdersLogic = require('../../business/orders-logic')( TransactionsLogic)
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

describe('orders', function () {
  it('should save an Order', function () {
    var stub = sandbox.stub(Order.prototype, 'save')
      .resolves()

    return OrdersLogic.saveOrder({})
      .then(() => {
        assert(stub.called)
      })
  })

  it('should get all orders', function () {
    var stub = sandbox.stub(Order, 'find')
      .resolves()

    return OrdersLogic.getOrders()
      .then(() => {
        assert(stub.called)
      })
  })

  it('should remove an order', function () {
    var stub = sandbox.stub(Order, 'remove')
      .resolves()

    return OrdersLogic.removeOrder()
      .then(() => {
        assert(stub.called)
      })
  })

  it('should make an order effective', function () {
    sandbox.stub(Order, 'findOneAndUpdate')
      .resolves({ transaction: {} })
    sandbox.stub(TransactionsLogic, 'saveTransaction')
      .resolves()

    return OrdersLogic.makeOrderEffective()
  })
})

function getDummyInputItems(n) {
  return [...Array(n)
      .keys()
    ]
    .map(k => ({ item: k, quantity: k % 2 ? k : -k }))
}
