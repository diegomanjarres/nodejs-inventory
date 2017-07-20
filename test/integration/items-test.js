const assert = require('chai')
  .assert
const request = require('supertest')
const app = require('../test-server.js')
const factory = require('../factory')
const testId = global.testDate + 'ITEMS'

describe('Items API Integration Tests', function () {
  let savedDummyItem = {}
  const dummyItems = factory.getDummyItems(testId, 1)
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
  it('should query created item', function (done) {
    request(app)
      .get('/items')
      .set('user', testId)
      .query({ name: dummyItems[0].name })
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.deepEqual(res.body[0], savedDummyItem)
        done()
      })
  })
  it('should get created item when getting all items', function (done) {
    request(app)
      .get('/items')
      .set('user', testId)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        const foundItem = res.body.find(i => (i.name === dummyItems[0].name))
        assert.deepEqual(foundItem, savedDummyItem)
        done()
      })
  })
  it('should update an item', function (done) {
    let updatedItem = Object.assign({}, savedDummyItem)
    updatedItem.description = 'updated description'
    delete updatedItem.__v
    request(app)
      .post('/items')
      .set('user', testId)
      .send(updatedItem)
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.equal(res.body.nModified, 1)
        done()
      })
  })
  it('should query updated item and show changes', function (done) {
    request(app)
      .get('/items')
      .set('user', testId)
      .query({ name: dummyItems[0].name })
      .end(function (err, res) {
        if (err) assert.fail()
        assert.equal(res.statusCode, 200)
        assert.notDeepEqual(res.body[0], savedDummyItem)
        assert.equal(res.body[0].description, 'updated description')
        done()
      })
  })
})
