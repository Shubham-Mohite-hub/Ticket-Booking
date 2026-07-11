const mongoose = require("mongoose");
const { BOOKING_STATUS, BOOKING_STATUS_VALUES } = require("../constants/bookingStatus");

const bookedSeatSchema = new mongoose.Schema(
  {
    row: {
      type: Number,
      required: [true, "Seat row is required"],
    },
    column: {
      type: Number,
      required: [true, "Seat column is required"],
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
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    seats: {
      type: [bookedSeatSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one seat is required",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: BOOKING_STATUS_VALUES,
      default: BOOKING_STATUS.PENDING,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;