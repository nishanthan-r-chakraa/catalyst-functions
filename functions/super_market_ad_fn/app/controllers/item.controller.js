const { ItemService } = require("../service/item.service");
const catalyst = require("zcatalyst-sdk-node");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const CacheService = require("../service/CacheService");
const FOLDER_ID = "29273000000026878";
const getItems = async (req, res) => {
  try {
    let catalystApp = catalyst.initialize(req);
    // let filestore = catalystApp.filestore();
    // let folder = filestore.folder(FOLDER_ID);

    // let downloadPromise = await folder.downloadFile("29273000000026966");

    const items = await ItemService.getItems(catalystApp);
    res.status(200).json({ message: "Items fetched successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const getItemsFromFile = async (req, res) => {
  try {
    const items = await ItemService.getItemsFile();
    res.status(200).json({ message: "Items fetched successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    let catalystApp = catalyst.initialize(req);
    const { name, price } = req.body;
    console.log(name, price);
    if (!name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let imageId = "";
    if (req.files) {
      const imageId = await uploadImage(catalystApp, req.files);
      console.log(imageId);
    }
    const items = await ItemService.addItem(catalystApp, {
      name,
      price,
      imageId,
    });
    // const items = [];
    res.status(200).json({
      status: "success",
      message: "Item added successfully",
      items,
      imageId,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const addItemToFile = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const items = await ItemService.addItemFile({ name, price });
    res.status(200).json({ message: "Item added successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
const updateItem = async (req, res) => {
  try {
    let catalystApp = catalyst.initialize(req);
    const { name, price, quantity } = req.body;
    console.log(name, price, quantity);
    if (!name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const id = BigInt(req.params.id);

    let imageId = "";
    if (req.files) {
      imageId = await uploadImage(catalystApp, req.files);
      console.log("imageId", imageId);
    }
    console.log({
      name,
      price,
      imageId,
      quantity,
    });
    const items = await ItemService.updateItem(id, catalystApp, {
      name,
      price,
      imageId,
      quantity,
    });
    res
      .status(200)
      .json({ status: "success", message: "Item updated successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const updateItemInFile = async (req, res) => {
  try {
    const { name, price } = req.body;
    const id = parseInt(req.params.id);
    const items = await ItemService.updateItemInFile(id, { name, price });
    res.status(200).json({ message: "Item updated successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    let catalystApp = catalyst.initialize(req);
    const id = BigInt(req.params.id);
    const items = await ItemService.deleteItem(id, catalystApp);
    res.status(200).json({ message: "Item deleted successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
//test
const deleteItemInFile = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await ItemService.deleteItemInFile(id);
    res.status(200).json({ message: "Item deleted successfully", items });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

async function uploadImage(catalystApp, files) {
  try {
    console.log(files.image.name);
    let userManagement = catalystApp.userManagement();
    let userPromise = await userManagement.getCurrentUser();

    await files.image.mv(`/tmp/${files.image.name}`);

    let res = await catalystApp
      .filestore()
      .folder(FOLDER_ID)
      .uploadFile({
        code: fs.createReadStream(`/tmp/${files.image.name}`),
        name: files.image.name,
      });
    console.log(res);
    return res.id;
  } catch (error) {
    console.error("Error uploading to Catalyst Filestore:", error);
    throw new Error("Error uploading to Catalyst Filestore: " + error.message);
  }
}

const getProductCountByStore = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const storeId = BigInt(req.params.id);
    const segmentId = "29273000000022068";
    const cacheService = new CacheService(catalystApp, segmentId);
    const cacheKey = "ItemCount";

    // Check cache first
    let itemCount = await cacheService.getCache(cacheKey);

    if (!itemCount) {
      // If not found in cache, get from DB
      itemCount = await ItemService.getProductCountByStore(
        catalystApp,
        storeId
      );
      // Store result in cache
      await cacheService.setCache(cacheKey, itemCount, 1);
    }

    res.status(200).json({ message: "Items fetched successfully", itemCount });
  } catch (error) {
    console.error("Error in getProductCountByStore:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getItems,
  getItemsFromFile,
  addItem,
  addItemToFile,
  updateItem,
  updateItemInFile,
  deleteItem,
  deleteItemInFile,
  getProductCountByStore,
};
