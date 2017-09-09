const assert = require('chai')
  .assert
const sinon = require('sinon')
const ItemsLogic = require('../../business/items-logic')()
const Item = require('../../models/item')

var sandbox
beforeEach(function () {
  sandbox = sinon.sandbox.create()
})

afterEach(function () {
  sandbox.restore()
})

describe('items', function () {
  it('should update an existing  item', function () {
    var stub = sandbox.stub(Item, 'update')
      .resolves()

    return ItemsLogic.upsertItem({ _id: 123 })
      .then(() => {
        assert(stub.called)
      })
  })

  it('should create an  item', function () {
    var stub = sandbox.stub(Item.prototype, 'save')
      .resolves()

    return ItemsLogic.upsertItem({})
      .then(() => {
        assert(stub.called)
      })
  })

  it('should get all items', function () {
    var stub = sandbox.stub(Item, 'find')
      .resolves()

    return ItemsLogic.getItems()
      .then(() => {
        assert(stub.called)
      })
  })

  it('should remove an  item', function () {
    var stub = sandbox.stub(Item, 'remove')
      .resolves()

    return ItemsLogic.removeItem()
      .then(() => {
        assert(stub.called)
      })
  })
})
