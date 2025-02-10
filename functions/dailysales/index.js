const catalyst = require("zcatalyst-sdk-node");
module.exports = async (cronDetails, context) => {
  try {
    console.log("Hello from index.js");
    // const app = catalyst.initialize(context);
    // let email = app.email();
    // console.log(email);

    // let config = {
    //   from_email: "nishanthan.r@chakraa.io",
    //   to_email: ["nishanthan.chakraa@gmail.com"],
    //   subject: "Sales Update!",
    //   content:
    //     "<h1>Hello</h1>,We're glad to welcome you at Zylker Corp. To begin your journey with us, please download the attached KYC form and fill in your details. You can send us the completed form to this same email address.We cannot wait to get started! Cheers! Team Zylker",
    // };

    // let mailPromise = await email.sendMail(config);
    // console.log(mailPromise);
    let salesUpdateObj = new SalesUpdate(context);
    await salesUpdateObj.init();
    // let cronParams = cronDetails.getCronParam('');
    // let remainingExecutionCount = cronDetails.getRemainingExecutionCount();
    // let thisCronDetails = cronDetails.getCronDetails();
    // let projectDetails = cronDetails.getProjectDetails();

    // let remainingTime = context.getRemainingExecutionTimeMs();
    // let executionTime = context.getMaxExecutionTimeMs();

    /* 
        CONTEXT FUNCTIONALITIES
    */
    context.closeWithSuccess(); //end of application with success
  } catch (error) {
    console.log(error);
    context.closeWithFailure(); //end of application with failure
  }
};

class SalesUpdate {
  constructor(context) {
    this.app = catalyst.initialize(context);
    this.zcql = this.app.zcql();
    this.email = this.app.email();
  }

  async init() {
    try {
      let stores = await this.getStores();
      console.log("Stores:", stores);

      let storeIds = stores.map((e) => `'${e.ROWID}'`).join(",");
      let orders = await this.getOrders(storeIds);

      for (let store of stores) {
        let storeOrders = orders[store.ROWID] || [];
        if (storeOrders.length === 0) continue;
        let emailContent = this.generateEmailContent(store.name, storeOrders);
        console.log(store);
        await this.sendEmail(store.email, emailContent);
      }
    } catch (error) {
      console.error("Error in init:", error);
    }
  }

  async getStores() {
    try {
      let stores = await this.zcql.executeZCQLQuery("SELECT * FROM stores");
      return stores.map((e) => e.stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      return [];
    }
  }

  async getOrders(storeIds) {
    try {
      let yesterday = new Date();
      //   yesterday.setDate(yesterday.getDate() - 1);
      let formattedDate = yesterday.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      console.log(formattedDate);
      let query = `
		SELECT 
			orders.item_id, 
			orders.store_id,
			items.name, 
			SUM(orders.total_price) AS total_price
		FROM orders
		INNER JOIN items ON items.ROWID = orders.item_id
		WHERE orders.store_id IN (${storeIds}) 
		and orders.CREATEDTIME BETWEEN '${formattedDate} 00:00:00' AND '${formattedDate} 23:59:59'
		GROUP BY orders.item_id, items.name,orders.store_id;
		`;
      console.log(query);
      let items = await this.zcql.executeZCQLQuery(query);

      let groupedOrders = items.reduce((acc, e) => {
        let storeId = e.orders.store_id;
        let order = {
          item_id: e.orders.item_id,
          item_name: e.items.name,
          order_value: e.orders["SUM(total_price)"],
        };

        if (!acc[storeId]) {
          acc[storeId] = [];
        }

        acc[storeId].push(order);
        return acc;
      }, {});

      return groupedOrders;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  }

  generateEmailContent(storeName, orders) {
    let orderRows = orders
      .map(
        (order) => `
      <tr>
        <td>${order.item_id}</td>
        <td>${order.item_name}</td>
        <td>${order.order_value.toFixed(2)}</td>
      </tr>`
      )
      .join("");
    return `
      <h1>Sales Report for ${storeName}</h1>
      <p>Here is your sales update:</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows}
        </tbody>
      </table>
      <p>Best Regards, <br/> Sales Team</p>
    `;
  }
  async sendEmail(toEmail, content) {
    try {
      let config = {
        from_email: "nishanthan.r@chakraa.io",
        to_email: [toEmail],
        subject: "Sales Update!",
        content: content,
        html_mode: true,
      };

      let mailPromise = await this.email.sendMail(config);
      console.log(`Email sent to ${toEmail}:`, mailPromise);
    } catch (error) {
      console.error(`Error sending email to ${toEmail}:`, error);
    }
  }
}
