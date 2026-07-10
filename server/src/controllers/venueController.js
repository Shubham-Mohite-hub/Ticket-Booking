const venueService = require("../services/venueService");
const ApiResponse = require("../utils/ApiResponse");

const createVenue = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const venue = await venueService.createVenue(req.body, userId);

    return res
      .status(201)
      .json(new ApiResponse(true, "Venue created successfully", venue));
  } catch (error) {
    next(error);
  }
};

const getAllVenues = async (req, res, next) => {
  try {
    const venues = await venueService.getAllVenues();

    return res
      .status(200)
      .json(new ApiResponse(true, "Venues fetched successfully", venues));
  } catch (error) {
    next(error);
  }
};

const getVenueById = async (req, res, next) => {
  try {
    const venue = await venueService.getVenueById(req.params.id);

    return res
      .status(200)
      .json(new ApiResponse(true, "Venue fetched successfully", venue));
  } catch (error) {
    next(error);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const venue = await venueService.updateVenue(req.params.id, req.body);

    return res
      .status(200)
      .json(new ApiResponse(true, "Venue updated successfully", venue));
  } catch (error) {
    next(error);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    await venueService.deleteVenue(req.params.id);

    return res
      .status(200)
      .json(new ApiResponse(true, "Venue deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};