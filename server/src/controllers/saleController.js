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
    const filter = {
      userId: req.user._id,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const sales = await Sale.find(filter)
      .populate("menuItemId", "name price")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    if (sale.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (sale.status !== "Completed") {
      return res.status(400).json({
        message:
          `Cannot cancel a sale with status '${sale.status}'`,
      });
    }

    sale.status = "Cancelled";

    if (req.body.cancelReason) {
      sale.cancelReason = req.body.cancelReason;
    }

    await sale.save();

    res.json({
      message: "Sale cancelled successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const revertSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    if (sale.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (sale.status !== "Completed") {
      return res.status(400).json({
        message:
          `Cannot revert a sale with status '${sale.status}'`,
      });
    }

    const recipes = await Recipe.find({
      menuItemId: sale.menuItemId,
    });

    for (const recipe of recipes) {
      const ingredient =
        await Ingredient.findById(recipe.ingredientId);

      ingredient.quantity +=
        recipe.quantityRequired *
        sale.quantitySold;

      await ingredient.save();
    }

    sale.status = "Reverted";
    sale.ingredientReverted = true;

    await sale.save();

    res.json({
      message: "Sale reverted successfully",
      sale,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSale,
  getSales,
  cancelSale,
  revertSale,
};