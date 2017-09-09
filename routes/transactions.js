'use strict'
/**
 * Created by daman on 11/27/2015.
 */

const express = require('express')
const router = express.Router()
const parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

function TransactionsRoutes(TransactionsLogic) {
  router.route('/transactions')
    .get(parseQueryDateRange, function ({ query, user }, res, next) {
      if (query.direction === 'incoming') query.quantity = { '$gte': 0 }
      else if (query.direction === 'outgoing') query.quantity = { '$lt': 0 }
      delete query.direction
      query.user = user._id
      TransactionsLogic.getTransactions(query)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/transactions')
    .post(function (req, res, next) {
      var transaction = req.body
      transaction.user = req.user._id
      TransactionsLogic.saveTransaction(transaction)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/transactions/delete/:id')
    .delete(function ({ query }, res, next) {
      TransactionsLogic.removeTransaction(query)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/transactions/transform')
    .post(function (req, res, next) {
      TransactionsLogic.transform(req.user._id, req.body)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/transactions/transferItem')
    .post(function (req, res, next) {
      let senderUserID = req.user._id
      var {
        itemID,
        quantity,
        recipientUserID
      } = req.body
      TransactionsLogic.transferStock(itemID, senderUserID, recipientUserID, quantity)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  return router
}

module.exports = TransactionsRoutes
