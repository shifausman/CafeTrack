const express = require("express");
const router = express.Router();

const {
  createSale,
  getSales,
  cancelSale,
  revertSale,
} = require("../controllers/saleController");

const { protect } = require("../middleware/authMiddleware");

router.put(
  "/:id/cancel",
  protect,
  cancelSale
);

router.put(
  "/:id/revert",
  protect,
  revertSale
);

router
  .route("/")
  .post(protect, createSale)
  .get(protect, getSales);

module.exports = router;