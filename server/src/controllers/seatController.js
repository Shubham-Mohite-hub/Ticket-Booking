const seatService = require("../services/seatService");
const ApiResponse = require("../utils/ApiResponse");

const getSeatMapByEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const seats = await seatService.getSeatMapByEvent(eventId);

    return res
      .status(200)
      .json(new ApiResponse(true, "Seat map fetched successfully", seats));
  } catch (error) {
    next(error);
  }
};

const holdSeats = async (req, res, next) => {
  try {
    const { eventId, seatIds } = req.body;
    const userId = req.user.userId;

    const result = await seatService.holdSeats(eventId, seatIds, userId);

    return res
      .status(200)
      .json(new ApiResponse(true, "Seats held successfully", result));
  } catch (error) {
    next(error);
  }
};

module.exports = { getSeatMapByEvent, holdSeats };