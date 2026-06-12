const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const {
  protect,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, createMenuItem)
  .get(protect, getMenuItems);

router
  .route("/:id")
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;