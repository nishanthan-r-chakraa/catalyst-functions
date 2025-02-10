const express = require("express");
const {
  addItemToFile,
  getItemsFromFile,
  updateItemInFile,
  deleteItemInFile,
} = require("../controllers/item.controller");

const router = express.Router();

router.get("/", getItemsFromFile);
router.post("/add", addItemToFile);
router.put("/update/:id", updateItemInFile);
router.delete("/delete/:id", deleteItemInFile);

module.exports = router;
