/**
 * Created by daman on 11/30/2015.
 */
var Item = require('../models/item');
var Transaction = require('../models/transaction');
var StockCache = require('../models/stockCache');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var async = require('async')
const InventoryLogic = require('../business/inventory-logic')

var multer = require('multer');

var db = require('../db.js');
var pdb = require('../pdb.js')
let parseQueryDateRange = require('../helpers/parametersParser')
  .parseQueryDateRange

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  return res.send("not authenticated");
};

router.route('/inventory/currentStock')
  .get(isAuthenticated, function (req, res) {
    var query = req.query;
    query.user = req.user._id;
    db.getCurrentStock(query, function (err, currStock) {
      if (err) return res.send(err);
      res.json(currStock);
    });
  });

router.route('/inventory/qtyIn')
  .get(isAuthenticated, function (req, res) {
    var query = req.query;
    query.user = req.user._id;

    db.getQuantityIn(query, function (err, qtyIn) {
      if (err) return res.send(err);
      res.json(qtyIn);
    });

  });

router.route('/inventory/qtyOut')
  .get(isAuthenticated, function (req, res) {
    var query = req.query;
    query.user = req.user._id;
    db.getQuantityOut(query, function (err, qtyOut) {
      if (err) return res.send(err);
      res.json(qtyOut);
    });
  });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    var dir = './uploads/' + req.user.username;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, './uploads/' + req.user.username + '/');
  },
  filename: function (req, file, cb) {
    cb(null, 'pmix.csv'); //file.fieldname + '-' + Date.now()
  }
});

var upload = multer({
    storage: storage
  })
  .single('file')
router.route('/inventory/uploadFile')
  .post(isAuthenticated, function (req, res) {

    upload(req, res, function (err) {
      if (err) return res.send(err)

      db.readFile('./uploads/' + req.user.username + '/pmix.csv', function (err, result) {
        if (err) return res.send(err)
        db.checkPlatesOnDataBase(result, req.user._id, function (err, result2) {
          if (err) return res.send(err)
          res.json(result2)
        })
      })
    })
  })

router.route('/inventory/isItemOnRecipe/:item')
  .get(isAuthenticated, function (req, res) {
    db.isItemOnRecipe(req.params.item, req.user._id, function (err, isIt) {
      if (err) return res.send(err)
      res.json(isIt)
    })
  })

router.route('/inventory/inventoryTableOld')
  .get(isAuthenticated, function (req, res) {
    var query = req.query
    query.user = req.user._id
    db.getInventoryTable(query, function (err, table) {
      if (err) return res.send(err)
      res.json(table)
    })
  })

router.route('/inventory/getLastProvider')
  .get(isAuthenticated, function (req, res) {
    var query = req.query
    query.user = req.user._id
    db.getLastProvider(query, function (err, result) {
      if (err) return res.send(err)
      res.json(result)
    })
  })

router.route('/inventory/platesToItems')
  .put(isAuthenticated, function (req, res) {
    db.platesToItems(req.body, req.user._id, function (err, result) {
      if (err) return res.send(err)
      res.json(result)
    })
  })

router.route('/inventory/inventoryTable')
  .get(isAuthenticated, parseQueryDateRange, function (req, res) {
    var query = req.query

    query.user = req.user._id
    let items
    pdb.getItems({
        user: query.user
      })
      .then(_items => {
        items = _items
        return pdb.getTransactions({
          user: query.user
        })
      })
      .then(transactions => {
        let table = items.map(item => {
          let itemTransactions = transactions.filter(t => item._id.equals(t.item))
          return {
            itemName: item.name,
            itemID: item._id,
            minStock: item.minStockReq,
            optStock: item.optStockReq,
            quantityIn: db.calculateActivity(itemTransactions, true),
            quantityOut: db.calculateActivity(itemTransactions, false)
          }
        })
        res.send(table)
      })
  })

router.route('/inventory/inventoryTableComplete')
  .get(isAuthenticated, parseQueryDateRange, function (req, res) {
    var query = req.query

    query.user = req.user._id
    let items
    pdb.getItems({
        user: query.user
      })
      .then(_items => {
        items = _items
        return pdb.getTransactions({
            user: query.user
          })
          .populate('provider')
      })
      .then(transactions => {
        let table = items.map(item => {
          let itemTransactions = transactions
            .filter(t => item._id.equals(t.item))
            .sort(compareTransactionsDates)
          let lastProvider = 'no provider'
          if (itemTransactions[0] &&
            itemTransactions[0].provider &&
            itemTransactions[0].provider.name) {
            lastProvider = itemTransactions[0].provider.name
          }
          return {
            itemName: item.name,
            itemID: item._id,
            itemUnits: item.units,
            minStock: item.minStockReq,
            optStock: item.optStockReq,
            quantityIn: db.calculateActivity(itemTransactions, true),
            quantityOut: db.calculateActivity(itemTransactions, false),
            lastProvider: lastProvider
          }
        })
        async.forEach(table, (tableItem, callback) => {
          db.getCurrentStock({
            item: tableItem.itemID,
            date: query.endDate,
            user: query.user
          }, (e, r) => {
            tableItem.currentStock = r
            tableItem.difference = r > tableItem.minStock ? 0 : tableItem.optStock - r
            callback()
          })
        }, (err) => {
          if (err) return res.send('Error adding transactions')
          res.send(table)
        })
      })
  })

let compareTransactionsDates = (a, b) => {
  return a.date.getTime() - b.date.getTime()
}

module.exports = router
