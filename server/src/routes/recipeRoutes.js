const express = require("express");
const router = express.Router();

const {
  createRecipe,
  getRecipes,
  getRecipesByMenuItem,
  deleteRecipe,
} = require("../controllers/recipeController");

const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, createRecipe)
  .get(protect, getRecipes);

router.get(
  "/menu/:menuItemId",
  protect,
  getRecipesByMenuItem
);

router.delete(
  "/:id",
  protect,
  deleteRecipe
);

module.exports = router;