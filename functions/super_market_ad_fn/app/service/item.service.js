const path = require("path");
const fs = require("fs").promises;
const filePath = path.join(__dirname, "items.json");

const ItemService = {
  getItems: async (catalystApp) => {
    try {
      // let userManagement = catalystApp.userManagement();
      // let userPromise = await userManagement.getCurrentUser();
      // console.log("'userPromise'", userPromise);
      // let zcql = catalystApp.zcql();
      // let query = "INSERT INTO stores (name) VALUES ('D-mart')";
      // let result = await zcql.executeZCQLQuery(query);
      // console.log(result);
      // return [];
      let zcql = catalystApp.zcql();
      let query = "SELECT * FROM items";
      let result = await zcql.executeZCQLQuery(query);
      console.log(result);
      return result.map((e) => e.items);
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  getItemsFile: async () => {
    try {
      console.log(filePath);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },
  addItem: async (catalystApp, item) => {
    try {
      let zcql = catalystApp.zcql();
      let query = `INSERT INTO items (name,price,image_id) VALUES ('${item.name}',${item.price},'${item.imageId}')`;
      console.log(query);
      let result = await zcql.executeZCQLQuery(query);
      return result.map((e) => e.items);
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  addItemFile: async (item) => {
    try {
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
      }
      const data = await fs.readFile(filePath, "utf-8");
      const items = JSON.parse(data);
      items.push({ ...item, id: items.length + 1 });

      await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
      return items;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  updateItem: async (id, catalystApp, item) => {
    try {
      console.log(item);
      let zcql = catalystApp.zcql();
      let query = `UPDATE items 
      SET name = '${item.name}', price = ${item.price} , image_id = '${item.imageId}' , quantity = ${item.quantity}
      WHERE ROWID = ${id};`;
      console.log(query);
      let result = await zcql.executeZCQLQuery(query);
      console.log(result);
      return result.map((e) => e.items);
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  updateItemInFile: async (id, item) => {
    try {
      console.log(filePath);
      const data = await fs.readFile(filePath, "utf-8");
      const items = JSON.parse(data);
      const itemIndex = items.findIndex((item) => item.id === id);
      if (itemIndex === -1) {
        return [];
      }
      items[itemIndex] = { ...items[itemIndex], ...item };
      await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
      return items;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  deleteItem: async (id, catalystApp) => {
    try {
      let zcql = catalystApp.zcql();
      let query = `DELETE FROM items WHERE ROWID = ${id};`;
      let result = await zcql.executeZCQLQuery(query);
      return result.map((e) => e.items);
    } catch (error) {
      return [];
    }
  },
  deleteItemInFile: async (id) => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const items = JSON.parse(data);
      const itemIndex = items.findIndex((item) => item.id === id);
      if (itemIndex === -1) {
        return [];
      }
      items.splice(itemIndex, 1);
      await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
      return items;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  getProductCountByStore: async (catalystApp, storeId) => {
    try {
      let zcql = catalystApp.zcql();
      let query = "SELECT COUNT(ROWID) AS count FROM items";
      let result = await zcql.executeZCQLQuery(query);
      return result?.[0]?.items["COUNT(ROWID)"];
    } catch (error) {
      return [];
    }
  },
  getItemsById: async (catalystApp, item_id) => {
    try {
      let zcql = catalystApp.zcql();
      let query = `SELECT * FROM items where ROWID in ('${item_id}')`;
      console.log(query);
      let result = await zcql.executeZCQLQuery(query);
      console.log(result);
      return result[0].items ?? [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
};

module.exports = { ItemService };
