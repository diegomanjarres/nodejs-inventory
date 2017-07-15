/**
 * Created by daman on 11/30/2015.
 */
var express = require('express')
var router = express.Router()
const InventoryLogic = require('../business/inventory-logic')

let parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

router.route('/inventory/currentStock')
  .get(function ({ query }, res, next) {
    InventoryLogic.getItemStock(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route(parseQueryDateRange, '/inventory/qtyIn')
  .get(function (req, res) {
    var query = req.query
    query.user = req.user._id

    db.getQuantityIn(query, function (err, qtyIn) {
      if (err) return res.send(err)
      res.json(qtyIn)
    })
  })

router.route(parseQueryDateRange, '/inventory/qtyOut')
  .get(function (req, res) {
    var query = req.query
    query.user = req.user._id
    db.getQuantityOut(query, function (err, qtyOut) {
      if (err) return res.send(err)
      res.json(qtyOut)
    })
  })

module.exports = router
