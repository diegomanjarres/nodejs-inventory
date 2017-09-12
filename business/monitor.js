module.exports = function (config, InventoryLogic) {
  function check(itemID) {
    console.log(itemID, InventoryLogic)
  }
  return { check }
}
