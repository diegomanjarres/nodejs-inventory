import 'babel-polyfill'
global.testDate = new Date()
  .toISOString()
  .replace(/T/, '')
  .replace(/-/g, '')
  .replace(/:/g, '')
  .replace(/\..+/, '')
  .replace()

require('./items-test')
require('./transactions-test')
require('./orders-test')
require('./inventory-test')
