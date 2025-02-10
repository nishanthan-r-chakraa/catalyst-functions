const express = require("express");
const order = require("../controllers/order.controller");

const router = express.Router();

router.post("/place", order.placeOrder);

module.exports = router;
