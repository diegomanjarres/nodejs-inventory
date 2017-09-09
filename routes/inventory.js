/**
 * Created by daman on 11/30/2015.
 */
var express = require('express')
var router = express.Router()
let parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

function InventoryRoutes(InventoryLogic) {
  router.route('/inventory/stockLevel')
    .get(function ({ query, user }, res, next) {
      query.user = user._id
      InventoryLogic.getItemStockLevel(query)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/inventory/stockPosition')
    .get(function ({ query, user }, res, next) {
      query.user = user._id
      InventoryLogic.getItemStockPosition(query)
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
  return router
}
module.exports = InventoryRoutes
