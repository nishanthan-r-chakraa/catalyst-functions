const express = require("express");
const fileUpload = require("express-fileupload");

const expressApp = express();
const itemRoutes = require("./app/routes/item.routes");
const itemFileRoutes = require("./app/routes/itemFile.routes");
const orderRoutes = require("./app/routes/order.routes");

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true })); // To parse form data
expressApp.use(fileUpload());

expressApp.use("/v1/products", itemRoutes);
expressApp.use("/v1/order", orderRoutes);
expressApp.use("/v1/file/products", itemFileRoutes);

module.exports = (req, res) => {
  expressApp(req, res);
};
