const mongoose = require("mongoose");
const Event = require("../models/Event");
const Venue = require("../models/Venue");
const ApiError = require("../utils/ApiError");
const { EVENT_STATUS } = require("../constants/eventStatus");

const createEvent = async (eventData, userId) => {
  const { venue, startTime, endTime } = eventData;

  const venueExists = await Venue.findById(venue);

  if (!venueExists) {
    throw new ApiError(404, "Venue not found");
  }

  if (startTime >= endTime) {
    throw new ApiError(400, "End time must be after start time");
  }

  const event = await Event.create({
    ...eventData,
    organizer: userId,
    status: EVENT_STATUS.DRAFT,
  });

  return event;
};

const getAllEvents = async () => {
  const events = await Event.find()
    .sort({ createdAt: -1 })
    .populate("venue", "name location")
    .populate("organizer", "name email role");

  return events;
};

const getEventById = async (eventId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await Event.findById(eventId)
    .populate("venue", "name location")
    .populate("organizer", "name email role");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

const updateEvent = async (eventId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (updateData.venue) {
    const venueExists = await Venue.findById(updateData.venue);

    if (!venueExists) {
      throw new ApiError(404, "Venue not found");
    }
  }

  const startTime = updateData.startTime || event.startTime;
  const endTime = updateData.endTime || event.endTime;

  if (startTime >= endTime) {
    throw new ApiError(400, "End time must be after start time");
  }

  Object.assign(event, updateData);

  await event.save();

  return event;
};

const deleteEvent = async (eventId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await Event.findByIdAndDelete(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};