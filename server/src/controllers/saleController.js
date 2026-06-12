const Sale = require("../models/Sale");
const MenuItem = require("../models/MenuItem");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

const createSale = async (req, res) => {
  try {
    const { menuItemId, quantitySold } = req.body;

    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    const recipes = await Recipe.find({
      menuItemId,
    });

    for (const recipe of recipes) {
      const ingredient = await Ingredient.findById(
        recipe.ingredientId
      );

      const quantityToDeduct =
        recipe.quantityRequired * quantitySold;

      if (ingredient.quantity < quantityToDeduct) {
        return res.status(400).json({
          message: `Not enough stock for ${ingredient.name}`,
        });
      }

      ingredient.quantity -= quantityToDeduct;

      await ingredient.save();
    }

    const totalAmount =
      menuItem.price * quantitySold;

    const sale = await Sale.create({
      userId: req.user._id,
      menuItemId,
      quantitySold,
      totalAmount,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({
      userId: req.user._id,
    }).populate("menuItemId", "name price");

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSale,
  getSales,
};