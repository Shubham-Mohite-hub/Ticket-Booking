const mongoose = require("mongoose");

const seatHoldSchema = new mongoose.Schema(
  {
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: [true, "Seat is required"],
      unique: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry time is required"],
    },
  },
  { timestamps: true }
);

seatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SeatHold = mongoose.model("SeatHold", seatHoldSchema);

module.exports = SeatHold;