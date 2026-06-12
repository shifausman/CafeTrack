const express = require("express");
const router = express.Router();

const {
  createIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
  getLowStockIngredients,
} = require("../controllers/ingredientController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, createIngredient)
  .get(protect, getIngredients);

router.get(
  "/low-stock",
  protect,
  getLowStockIngredients
);

router.route("/:id")
  .put(protect, updateIngredient)
  .delete(protect, deleteIngredient);

module.exports = router;