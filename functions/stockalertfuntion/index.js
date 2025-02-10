const catalyst = require("zcatalyst-sdk-node");

module.exports = async (event, context) => {
  try {
    /* 
        EVENT FUNCTIONALITIES
    */
    const DATA = event.data; //event data
    // const TIME = event.time; //event occured time

    const SOURCE_DETAILS = event.getSourceDetails(); //event source details
    const SOURCE_ACTION = SOURCE_DETAILS.action; //(insert | fetch | invoke ...)
    // const SOURCE_TYPE = SOURCE_DETAILS.type; //(datastore | cache | queue ...)
    // const SOURCE_ENTITY_ID = SOURCE_DETAILS.entityId; //if type is datastore then entity id is tableid

    // const SOURCE_BUS_DETAILS = SOURCE_DETAILS.getBusDetails(); //event bus details
    // const SOURCE_BUS_ID = SOURCE_BUS_DETAILS.id; //event bus id

    // const PROJECT_DETAILS = event.getProjectDetails(); //event project details
    // const FUNCTION_DETAILS = event.getFunctionDetails(); //event function details

    const app = catalyst.initialize(context);

    console.log("SOURCE_ACTION", SOURCE_ACTION);
    console.log(JSON.stringify(DATA));

    for (const { orders } of DATA) {
      console.log(orders);

      let stockManagement = new StockManagement(context, orders);
      await stockManagement.updateStock();
    }

    /* 
			  CONTEXT FUNCTIONALITIES
		  */
    context.closeWithSuccess(); //end of application with success
  } catch (error) {
    console.error(error);
    context.closeWithFailure(); //end of application with failure
  }
};

class StockManagement {
  constructor(context, data) {
    this.app = catalyst.initialize(context);
    this.zcql = this.app.zcql();
    this.orderData = data;
  }

  async getCurrentStock() {
    let { item_id } = this.orderData;

    let query = `SELECT quantity FROM items WHERE ROWID = '${item_id}'`;
    let result = await this.zcql.executeZCQLQuery(query);

    return result?.[0]?.items?.quantity ?? 0;
  }

  async updateStock() {
    let { item_id, quantity } = this.orderData;

    try {
      // Fetch the current stock with row lock (Zoho Catalyst lacks row-level locks, so we need a workaround)
      let currentStock = await this.getCurrentStock();
      let newStock = currentStock - quantity;
      if (newStock < 0) {
        newStock = 0;
      }
      // Atomic update to prevent race conditions
      let query = `
		  UPDATE items 
		  SET quantity = ${newStock} 
		  WHERE ROWID = '${item_id}'`;

      let result = await this.zcql.executeZCQLQuery(query);
      // Check if update was successful (if no rows were updated, it means stock changed)
      if (!result || result.length === 0) {
        throw new Error("Stock update failed due to concurrent orders");
      }
      if (newStock === 0) {
        await this.createPO();
      }
      return { success: true, message: "Stock updated successfully" };
    } catch (error) {
      console.error("Stock update error:", error.message);
      return { success: false, message: error.message };
    }
  }
  async createPO() {
    let { item_id, quantity, store_id } = this.orderData;
    let poQty = 100;
    let query = `INSERT INTO purchase_orders (item_id, quantity, store_id) VALUES ('${item_id}', ${poQty}, '${store_id}')`;
    let result = await this.zcql.executeZCQLQuery(query);
    console.log(result);
  }
}
