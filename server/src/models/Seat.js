const mongoose = require("mongoose");
const { SEAT_STATUS, SEAT_STATUS_VALUES } = require("../constants/seatStatus");

const seatSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    row: {
      type: Number,
      required: [true, "Seat row is required"],
      min: [1, "Seat row must be at least 1"],
    },
    column: {
      type: Number,
      required: [true, "Seat column is required"],
      min: [1, "Seat column must be at least 1"],
    },
    category: {
      type: String,
      required: [true, "Seat category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Seat price is required"],
      min: [0, "Seat price cannot be negative"],
    },
    status: {
      type: String,
      enum: SEAT_STATUS_VALUES,
      default: SEAT_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

seatSchema.index({ event: 1, row: 1, column: 1 }, { unique: true });

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;