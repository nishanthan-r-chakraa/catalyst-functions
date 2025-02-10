const catalyst = require("zcatalyst-sdk-node");
const { ItemService } = require("../service/item.service");

const Order = {
  placeOrder: async (req, res) => {
    try {
      let catalystApp = catalyst.initialize(req);
      let { item_id, quantity, store_id } = req.body;
      //   const itemIds = lineItems.map((item) => item.item_id).join(",");
      let itemObj = await ItemService.getItemsById(catalystApp, item_id);
      console.log(itemObj);
      quantity = parseInt(quantity) || 1;

      if (parseInt(itemObj?.quantity) < quantity) {
        throw new Error("Insufficient quantity");
      }

      let orderObj = {
        item_id: item_id,
        quantity: quantity,
        total_price: quantity * parseFloat(itemObj.price),
      };

      let zcql = catalystApp.zcql();
      let query = `INSERT INTO orders (item_id, quantity, total_price,store_id) VALUES ('${item_id}', ${quantity}, ${orderObj.total_price} ,'${store_id}');`;
      console.log(query);
      let result = await zcql.executeZCQLQuery(query);
      res.json({
        status: "success",
        message: "Order placed successfully",
        result,
        orderObj,
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error", message: error.message });
    }
  },
};

module.exports = Order;
