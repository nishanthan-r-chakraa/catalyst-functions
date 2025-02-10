var express = require("express");
var app = express();
var catalyst = require("zcatalyst-sdk-node");
app.use(express.json());
app.use(express.static("public"));

app.get("/test", async (req, res) => {
  try {
    console.log(req.body);
    var catalystApp = catalyst.initialize(req);

    let zcql = catalystApp.zcql();
    let query = "SELECT * FROM items";
    let items = await zcql.executeZCQLQuery(query);
    res.status(200).json({ message: "success", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
let port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
app.listen(port, () => {});
console.log(port);
module.exports = app;
