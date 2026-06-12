const Sale = require("../models/Sale");
const Ingredient = require("../models/Ingredient");
const MenuItem = require("../models/MenuItem");
const Expense = require("../models/Expense");
const Recipe = require("../models/Recipe");

const getDashboardData = async (req, res) => {
  try {
    const sales = await Sale.find({
      userId: req.user._id,
    });

    const expenses = await Expense.find({
      userId: req.user._id,
    });

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const profit =
      totalRevenue - totalExpenses;

    const totalSales = sales.length;

    const totalIngredients =
      await Ingredient.countDocuments({
        userId: req.user._id,
      });

    const totalMenuItems =
      await MenuItem.countDocuments({
        userId: req.user._id,
      });

    const ingredients = await Ingredient.find({
      userId: req.user._id,
    });

    const lowStockItems = ingredients.filter(
      (item) =>
        item.quantity <= item.minimumStock
    );

    res.json({
      totalRevenue,
      totalExpenses,
      profit,
      totalSales,
      totalIngredients,
      totalMenuItems,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const sales = await Sale.find({
      userId: req.user._id,
      createdAt: { $gte: startOfMonth },
    });

    const expenses = await Expense.find({
      userId: req.user._id,
      createdAt: { $gte: startOfMonth },
    });

    const salesThisMonth = sales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    const expensesThisMonth = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    res.json({
      salesThisMonth,
      expensesThisMonth,
      profitThisMonth:
        salesThisMonth - expensesThisMonth,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTopSellingItems = async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$menuItemId",
          quantitySold: {
            $sum: "$quantitySold",
          },
        },
      },
      {
        $sort: {
          quantitySold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    const populatedSales =
      await MenuItem.populate(sales, {
        path: "_id",
        select: "name",
      });

    res.json(populatedSales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getIngredientUsage = async (
  req,
  res
) => {
  try {
    const sales = await Sale.find({
      userId: req.user._id,
    });

    const usage = {};

    for (const sale of sales) {
      const recipes =
        await Recipe.find({
          menuItemId: sale.menuItemId,
        }).populate(
          "ingredientId",
          "name"
        );

      for (const recipe of recipes) {
        const ingredientName =
          recipe.ingredientId.name;

        const used =
          recipe.quantityRequired *
          sale.quantitySold;

        usage[ingredientName] =
          (usage[ingredientName] || 0) +
          used;
      }
    }

    res.json(usage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
  getAnalytics,
  getTopSellingItems,
  getIngredientUsage,
};