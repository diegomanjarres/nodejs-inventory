const assert = require('chai')
  .assert
const request = require('supertest')
const async = require('async')
const app = require('../test-server.js')
const factory = require('../factory')
const testId = global.testDate + 'TRANSACTIONS'

describe('Transactions API Integration Tests', function () {
  let savedDummyItem = {}
  const numTransactions = 10
  const dummyItems = factory.getDummyItems(testId, 1)
  let dummyTransactions = []
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

  it('should get the created transactions', function (done) {
    request(app)
      .get('/transactions')
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.equal(res.body.length, numTransactions)
        done()
      })
  })
  it('should get the incoming transactions only', function (done) {
    request(app)
      .get('/transactions')
      .query({ direction: 'incoming' })
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.isAtLeast(res.body.length, numTransactions / 2 - 1)
        assert.isAtMost(res.body.length, numTransactions / 2 + 1)
        done()
      })
  })
  it('should get the outgoing transactions only', function (done) {
    request(app)
      .get('/transactions')
      .query({ direction: 'outgoing' })
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.isAtLeast(res.body.length, numTransactions / 2 - 1)
        assert.isAtMost(res.body.length, numTransactions / 2 + 1)
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
