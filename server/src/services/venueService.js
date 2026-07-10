const mongoose = require("mongoose");
const Venue = require("../models/Venue");
const ApiError = require("../utils/ApiError");

const createVenue = async (venueData, userId) => {
  const venue = await Venue.create({
    ...venueData,
    createdBy: userId,
  });

  return venue;
};

const getAllVenues = async () => {
  const venues = await Venue.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email role");

  return venues;
};

const getVenueById = async (venueId) => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    throw new ApiError(400, "Invalid venue id");
  }

  const venue = await Venue.findById(venueId).populate("createdBy", "name email role");

  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  return venue;
};

const updateVenue = async (venueId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    throw new ApiError(400, "Invalid venue id");
  }

  const venue = await Venue.findById(venueId);

  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  Object.assign(venue, updateData);

  await venue.save();

  return venue;
};

const deleteVenue = async (venueId) => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    throw new ApiError(400, "Invalid venue id");
  }

  const venue = await Venue.findByIdAndDelete(venueId);

  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  return venue;
};

module.exports = {
  createVenue,
  getAllVenues,
  getVenueById,
  deleteVenue,
  updateVenue,
};