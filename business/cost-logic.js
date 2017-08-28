function getAverageCost(transactions) {
  return transactions.reduce((memo, act) => {
    return memo + act.unitPrice
  }, 0)
}
module.exports = {
  getAverageCost
}
