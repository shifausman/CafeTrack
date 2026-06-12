const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  getAnalytics,
  getTopSellingItems,
  getIngredientUsage,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getDashboardData);
router.get(
  "/analytics",
  protect,
  getAnalytics
);
router.get(
  "/top-items",
  protect,
  getTopSellingItems
);
router.get(
  "/ingredient-usage",
  protect,
  getIngredientUsage
);

module.exports = router;