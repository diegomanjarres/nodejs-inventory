/**
 * Created by daman on 11/30/2015.
 */
var express = require('express')
var router = express.Router()
const InventoryLogic = require('../business/inventory-logic')

let parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

router.route('/inventory/stock')
  .get(function ({ query, user }, res, next) {
    query.user = user._id
    InventoryLogic.getItemStock(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/inventory/qtyIn')
  .get(parseQueryDateRange, function ({ query, user }, res, next) {
    query.user = user._id
    InventoryLogic.quantityIn(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/inventory/qtyOut')
  .get(parseQueryDateRange, function ({ query, user }, res, next) {
    query.user = user._id
    InventoryLogic.quantityOut(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

module.exports = router
