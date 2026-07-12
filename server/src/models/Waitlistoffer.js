const mongoose = require("mongoose");

const waitlistOfferSchema = new mongoose.Schema(
  {
    waitlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Waitlist",
      required: [true, "Waitlist reference is required"],
      unique: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: [true, "Seat is required"],
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

waitlistOfferSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
waitlistOfferSchema.index({ user: 1, event: 1 });

const WaitlistOffer = mongoose.model("WaitlistOffer", waitlistOfferSchema);

module.exports = WaitlistOffer;