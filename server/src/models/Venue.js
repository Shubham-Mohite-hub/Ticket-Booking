const mongoose = require("mongoose");

const seatCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Seat category name is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Seat category color is required"],
      trim: true,
    },
    priceMultiplier: {
      type: Number,
      required: [true, "Price multiplier is required"],
      min: [0, "Price multiplier cannot be negative"],
    },
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    rows: {
      type: Number,
      required: [true, "Rows is required"],
      min: [1, "Rows must be at least 1"],
    },
    columns: {
      type: Number,
      required: [true, "Columns is required"],
      min: [1, "Columns must be at least 1"],
    },
    seatCategories: {
      type: [seatCategorySchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one seat category is required",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;