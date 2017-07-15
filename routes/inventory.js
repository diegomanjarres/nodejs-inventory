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
  .get(function ({query}, res, next) {
    InventoryLogic.quantityIn(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route(parseQueryDateRange, '/inventory/qtyOut')
  .get(function ({query}, res, next) {
    InventoryLogic.quantityOut(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

module.exports = router
