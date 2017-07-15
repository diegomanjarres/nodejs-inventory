var StockCache = require('../models/itemStockCache')

let getClosestPreviousStockRecord = (query) => {
  return StockCache.findOne(query, {}, { 'date': -1 })
}
let insertStockRecord = (record) => {
  new StockCache(record).save()
}

module.exports = {
  getClosestPreviousStockRecord,
  insertStockRecord
}
