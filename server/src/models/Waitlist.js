const mongoose = require("mongoose");
const { WAITLIST_STATUS, WAITLIST_STATUS_VALUES } = require("../constants/waitlistStatus");

const waitlistSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    status: {
      type: String,
      enum: WAITLIST_STATUS_VALUES,
      default: WAITLIST_STATUS.WAITING,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

waitlistSchema.index({ event: 1, category: 1, user: 1 }, { unique: true });
waitlistSchema.index({ event: 1, category: 1, status: 1, joinedAt: 1 });

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

module.exports = Waitlist;