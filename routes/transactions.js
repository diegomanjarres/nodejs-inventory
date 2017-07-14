'use strict'
/**
 * Created by daman on 11/27/2015.
 */

const express = require('express')
const router = express.Router()
const TransactionsLogic = require('../business/transactions-logic')
const isAuthenticated = require('../passport/auth-middleware')
  .isAuthenticated
const parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

router.route('/transactions')
  .get(isAuthenticated, parseQueryDateRange, function ({ query }, res, next) {
    if (query.direction == 0) query.quantity = {
      '$gte': 0
    }
    else if (query.direction == 2) query.quantity = {
      '$lt': 0
    }
    delete query.direction
    TransactionsLogic.getTransactions(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/transactions')
  .post(isAuthenticated, function (req, res, next) {
    var transaction = req.body
    transaction.user = req.user._id
    TransactionsLogic.saveTransaction(transaction)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/transactions/delete/:id')
  .delete(isAuthenticated, function ({ query }, res, next) {
    TransactionsLogic.removeTransaction(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/transactions/transform')
  .post(isAuthenticated, function (req, res, next) {
    TransactionsLogic.transform(req.user._id, req.body)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/transactions/transferItem')
  .post(isAuthenticated, function (req, res, next) {
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

module.exports = router
