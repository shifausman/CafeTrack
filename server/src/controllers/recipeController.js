const Recipe = require("../models/Recipe");

const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({
      userId: req.user._id,
      menuItemId: req.body.menuItemId,
      ingredientId: req.body.ingredientId,
      quantityRequired: req.body.quantityRequired,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      userId: req.user._id,
    })
      .populate("menuItemId", "name")
      .populate("ingredientId", "name unit");

    res.json(recipes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecipesByMenuItem = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      userId: req.user._id,
      menuItemId: req.params.menuItemId,
    })
      .populate("menuItemId", "name")
      .populate("ingredientId", "name unit");

    res.json(recipes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await recipe.deleteOne();

    res.json({
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipesByMenuItem,
  deleteRecipe,
};