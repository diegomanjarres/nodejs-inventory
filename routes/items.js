/**
 * Created by daman on 11/27/2015.
 */
const express = require('express')
const router = express.Router()

function ItemsRoutes(ItemsLogic) {
  router.route('/items/:id')
    .get(({ params }, res, next) => {
      ItemsLogic.getItems(params)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/items')
    .get(({ query, user }, res, next) => {
      query.user = user._id
      ItemsLogic.getItems(query)
        .then(res.json.bind(res))
        .catch((err) => next(err))
    })

  router.route('/items')
    .post((req, res, next) => {
      let item = req.body
      item.user = req.user._id
      ItemsLogic.upsertItem(item)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })

  router.route('/items/delete/:id')
    .delete(({ query }, res, next) => {
      ItemsLogic.removeItem(query)
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })
  return router
}

module.exports = ItemsRoutes
