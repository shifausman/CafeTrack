const Ingredient = require("../models/Ingredient");

const createIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.create({
      userId: req.user._id,
      name: req.body.name,
      quantity: req.body.quantity,
      unit: req.body.unit,
      minimumStock: req.body.minimumStock,
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getIngredients = async (req, res) => {
  try {
    const search = req.query.search || "";

    const ingredients = await Ingredient.find({
      userId: req.user._id,
      name: {
        $regex: search,
        $options: "i",
      },
    });

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    if (ingredient.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    ingredient.name = req.body.name || ingredient.name;
    ingredient.quantity =
      req.body.quantity ?? ingredient.quantity;
    ingredient.unit = req.body.unit || ingredient.unit;
    ingredient.minimumStock =
      req.body.minimumStock ?? ingredient.minimumStock;

    const updatedIngredient = await ingredient.save();

    res.json(updatedIngredient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    if (ingredient.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await ingredient.deleteOne();

    res.json({
      message: "Ingredient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getLowStockIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      userId: req.user._id,
    });

    const lowStockItems = ingredients.filter(
      (ingredient) =>
        ingredient.quantity <= ingredient.minimumStock
    );

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
  getLowStockIngredients,
};