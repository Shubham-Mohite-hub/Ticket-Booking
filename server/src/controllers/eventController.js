const eventService = require("../services/eventService");
const ApiResponse = require("../utils/ApiResponse");

const createEvent = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const event = await eventService.createEvent(req.body, userId);

    return res
      .status(201)
      .json(new ApiResponse(true, "Event created successfully", event));
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();

    return res
      .status(200)
      .json(new ApiResponse(true, "Events fetched successfully", events));
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);

    return res
      .status(200)
      .json(new ApiResponse(true, "Event fetched successfully", event));
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);

    return res
      .status(200)
      .json(new ApiResponse(true, "Event updated successfully", event));
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);

    return res
      .status(200)
      .json(new ApiResponse(true, "Event deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};