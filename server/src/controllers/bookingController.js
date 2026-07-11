const bookingService = require("../services/bookingService");
const ApiResponse = require("../utils/ApiResponse");

const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const booking = await bookingService.createBooking(req.body, userId);

    return res
      .status(201)
      .json(new ApiResponse(true, "Booking created successfully", booking));
  } catch (error) {
    next(error);
  }
};

const getAllBookingsForUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const bookings = await bookingService.getAllBookingsForUser(userId);

    return res
      .status(200)
      .json(new ApiResponse(true, "Bookings fetched successfully", bookings));
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const { userId, role } = req.user;

    const booking = await bookingService.getBookingById(bookingId, userId, role);

    return res
      .status(200)
      .json(new ApiResponse(true, "Booking fetched successfully", booking));
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const { userId, role } = req.user;

    const booking = await bookingService.cancelBooking(bookingId, userId, role);

    return res
      .status(200)
      .json(new ApiResponse(true, "Booking cancelled successfully", booking));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getAllBookingsForUser,
  getBookingById,
  cancelBooking,
};