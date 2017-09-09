const assert = require('chai')
  .assert
const request = require('supertest')
const app = require('../test-server.js')
const testId = global.testDate + 'ORDERS'

describe('Orders API Integration Tests', function () {
  let savedDummyOrder = {}
  it('should create an order', function (done) {
    request(app)
      .post('/orders')
      .set('user', testId)
      .send({ transaction: { description: 'orders test' } })
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        savedDummyOrder = res.body
        assert.equal(savedDummyOrder.transaction.description, 'orders test')
        done()
      })
  })

  it('should make an order effective', function (done) {
    request(app)
      .post('/orders/' + savedDummyOrder._id + '/makeEffective')
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        done()
      })
  })

  it('should get the created order', function (done) {
    request(app)
      .get('/orders')
      .set('user', testId)
      .query({ _id: savedDummyOrder._id })
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.notEqual(null, res.body[0].effectiveDate)
        done()
      })
  })
})
