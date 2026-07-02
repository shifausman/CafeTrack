const MenuItem = require("../models/MenuItem");

const createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create({
      userId: req.user._id,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const search = req.query.search || "";

    const menuItems = await MenuItem.find({
      userId: req.user._id,
      name: {
        $regex: search,
        $options: "i",
      },
    });

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    if (menuItem.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    menuItem.name = req.body.name || menuItem.name;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.price = req.body.price ?? menuItem.price;
    menuItem.isAvailable =
      req.body.isAvailable ?? menuItem.isAvailable;

    const updatedMenuItem = await menuItem.save();

    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    if (menuItem.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await menuItem.deleteOne();

    res.json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};