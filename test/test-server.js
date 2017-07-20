const app = require('express')()
const bodyParser = require('body-parser')
const nodejsInventory = require('../index.js')

nodejsInventory.connect(process.env.DB || 'localhost:27017/nodejs-inventory-test')

app.use(bodyParser.json())

app.use((req, res, next) => {
  req.user = { _id: req.headers.user }
  req.query.user = req.user
  next()
})
app.use('/', nodejsInventory.allRoutes)

app.listen(process.env.PORT || 8000)

module.exports = app
