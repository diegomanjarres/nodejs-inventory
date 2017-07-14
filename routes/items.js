/**
 * Created by daman on 11/27/2015.
 */
const express = require('express')
const router = express.Router()
const ItemsLogic = require('../business/items-logic')
const isAuthenticated = require('../passport/auth-middleware')
  .isAuthenticated

router.route('/:id')
  .get(isAuthenticated, ({ params }, res, next) => {
    ItemsLogic.getItems(params)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/')
  .get(isAuthenticated, ({ query }, res, next) => {
    ItemsLogic.getItems(query)
      .then(res.json.bind(res))
      .catch((err) => next(err))
  })

router.route('/')
  .post(isAuthenticated, (req, res, next) => {
    let item = req.body
    item.user = req.user._id
    ItemsLogic.upsertItem(item)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

router.route('/delete/:id')
  .delete(isAuthenticated, ({ query }, res, next) => {
    ItemsLogic.removeItem(query)
      .then((result) => res.json(result))
      .catch((err) => next(err))
  })

module.exports = router
