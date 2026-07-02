const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    quantitySold: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // NEW
    status: {
      type: String,
      enum: [
        "Completed",
        "Cancelled",
        "Reverted",
      ],
      default: "Completed",
    },

    // NEW
    ingredientReverted: {
      type: Boolean,
      default: false,
    },

    // Optional (good for future)
    cancelReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Sale",
  saleSchema
);