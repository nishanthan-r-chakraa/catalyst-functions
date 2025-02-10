const express = require("express");
const multer = require("multer");

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp/"); // Temporary storage before upload
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getProductCountByStore,
} = require("../controllers/item.controller");

const router = express.Router();

router.get("/", getItems);
router.post("/add", addItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);
router.get("/count/:id", getProductCountByStore);
module.exports = router;
