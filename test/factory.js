function getDummyItems(testId, n) {
  return [...Array(n)
    .keys()
  ].map(k => (newItem(testId, k)))
}

function getDummyTransactions(itemId, testId, n) {
  return [...Array(n)
    .keys()
  ].map(k => (newTransaction(itemId, testId, k)))
}

function getDummyOrders(itemId, testId, n) {
  return [...Array(n)
    .keys()
  ].map(k => (newOrder(itemId, testId, k)))
}

function newItem(testId, counter) {
  return {
    name: 'testItem ' + testId + ' ' + counter,
    description: 'description',
    minStockReq: 0,
    optStock: 10,
    extIDs: [],
    units: 'kg',
    unitsType: 'mass',
    category: 'category',
    lossCost: 0
  }
}

function newTransaction(itemId, testId, counter) {
  return {
    item: itemId,
    date: new Date(),
    quantity: counter % 2 ? 100 * (1 + counter) : -100 * (1 + counter),
    description: 'transaction for test: ' + testId + ' number ' + counter,
    type: 'test',
    unitPrice: 100,
    invoiceNumber: testId + ' ' + counter
  }
}

function newOrder(itemId = 'item' + testId + 0, testId, counter) {
  return {
    transaction: newTransaction(itemId, testId, (counter * 2) + 1),
    orderCost: 1,
    issueDate: new Date()
  }
}

module.exports = {
  getDummyItems,
  getDummyTransactions,
  getDummyOrders
}
