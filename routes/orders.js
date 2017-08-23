'use strict'
/**
 * Created by daman on 22/087/2017.
 */

const express = require('express')
const router = express.Router()
const OrdersLogic = require('../business/orders-logic')
const parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

router.route('/orders')
  .get(parseQueryDateRange, function ({ query, user }, res, next) {
    query.user = user._id
    OrdersLogic.getOrders(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/orders')
  .post(function (req, res, next) {
    var order = req.body
    order.user = req.user._id
    OrdersLogic.saveOrder(order)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/orders/delete/:id')
  .delete(function ({ query }, res, next) {
    OrdersLogic.removeOrder(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/orders/:id/makeEffective')
  .post(function (req, res, next) {
    OrdersLogic.makeEffective(req.user._id, req.params.id)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

module.exports = router
