const assert = require('chai')
  .assert
const request = require('supertest')
const async = require('async')
const app = require('../test-server.js')
const factory = require('../factory')
const testId = global.testDate + 'INVENTORY'

describe('Inventory API Integration Tests', function () {
  let savedDummyItem = {}
  const numTransactions = 10
  const numOrders = 2
  const dummyItems = factory.getDummyItems(testId, 1)
  let dummyTransactions = []
  let dummyOrders = []
  it('should create an item', function (done) {
    request(app)
      .post('/items')
      .set('user', testId)
      .send(dummyItems[0])
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        savedDummyItem = res.body
        assert.equal(savedDummyItem.name, dummyItems[0].name)
        assert.equal(savedDummyItem.category, dummyItems[0].category)
        assert.equal(savedDummyItem.description, dummyItems[0].description)
        assert.equal(savedDummyItem.user, testId)
        done()
      })
  })

  it('should add some transactions for that item', function (done) {
    dummyTransactions = factory.getDummyTransactions(savedDummyItem._id, testId, numTransactions)
    async.concat(dummyTransactions, postTransaction, function (err, responses) {
      if (err) assert.fail()
      responses.forEach(function (res) {
        assert.equal(res.statusCode, 200)
        assert.equal(res.body.item, savedDummyItem._id)
      })
      done()
    })
  })

  it('should add some orders for that item', function (done) {
    dummyOrders = factory.getDummyOrders(savedDummyItem._id, testId, numOrders)
    async.concat(dummyOrders, postOrder, function (err, responses) {
      if (err) assert.fail()
      responses.forEach(function (res) {
        assert.equal(res.statusCode, 200)
      })
      done()
    })
  })

  it('should  get an item`s current stock', function (done) {
    request(app)
      .get('/inventory/stockLevel')
      .query({ item: savedDummyItem._id })
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.equal(res.body, 500)
        done()
      })
  })

  it('should  get an item`s current stock Position', function (done) {
    request(app)
      .get('/inventory/stockPosition')
      .query({ item: savedDummyItem._id })
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.equal(res.body, 1100)
        done()
      })
  })

  it('should get  an item`s incoming quantity', function (done) {
    request(app)
      .get('/inventory/qtyIn')
      .query({ item: savedDummyItem._id })
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.equal(res.body, 3000)
        done()
      })
  })
  it('should get  an item`s outgoing quantity', function (done) {
    request(app)
      .get('/inventory/qtyOut')
      .query({ item: savedDummyItem._id })
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.equal(res.body, 2500)
        done()
      })
  })
})

function postTransaction(transaction, cb) {
  request(app)
    .post('/transactions')
    .set('user', testId)
    .send(transaction)
    .end(cb)
}

function postOrder(order, cb) {
  request(app)
    .post('/orders')
    .set('user', testId)
    .send(order)
    .end(cb)
}
