const InventoryLogic = require('./inventory-logic.js')
const Q = require('q')

function getTransformationCost (transformation) {
  let { inputItems } = transformation
  let promises = inputItems.map((item) => {
    let deferred = Q.defer()
    InventoryLogic.getItemStock({ _id: item._id })
      .then(stock => {
        deferred.resolve(stock * item.quantity)
      })
    return deferred.promise
  })
  Q.all(promises)
    .done(values => {
      return Q(values.reduce((m, i) => (m + i), 0))
    })
}

function getAverageCost(transactions){
  return transactions.reduce((memo,act)=>{
    return memo+act.unitPrice
  },0)
}
module.exports = { getTransformationCost }
