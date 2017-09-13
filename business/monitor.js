module.exports = function (config, InventoryLogic) {
  function check(itemID) {
    InventoryLogic.getItemStockLevel(itemID)
    console.log(itemID, InventoryLogic)
  }
  return { check }
}
