const Item = require('../models/item')

let upsertItem = (_item) => {
  if (_item._id) return Item.update({ _id: _item._id }, _item)
  return new Item(_item)
    .save()
}

let getItems = (query) => (Item.find(query))

let removeItem = (query) => (Item.remove(query))

function ItemsLogic() {
  return {
    upsertItem,
    getItems,
    removeItem
  }
}
module.exports = ItemsLogic
