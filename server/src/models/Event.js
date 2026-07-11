const mongoose = require("mongoose");
const { EVENT_STATUS, EVENT_STATUS_VALUES } = require("../constants/eventStatus");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue is required"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:mm format"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:mm format"],
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Base price cannot be negative"],
    },
    status: {
      type: String,
      enum: EVENT_STATUS_VALUES,
      default: EVENT_STATUS.DRAFT,
    },
    bannerImage: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;