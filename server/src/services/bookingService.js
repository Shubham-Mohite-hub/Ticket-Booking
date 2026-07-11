const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const ApiError = require("../utils/ApiError");
const { BOOKING_STATUS } = require("../constants/bookingStatus");
const { EVENT_STATUS } = require("../constants/eventStatus");
const { ROLES } = require("../constants/roles");

const SEAT_HOLD_TTL_MINUTES = 10;

const createBooking = async (bookingData, userId) => {
  const { event, seats } = bookingData;

  const eventDoc = await Event.findById(event);

  if (!eventDoc) {
    throw new ApiError(404, "Event not found");
  }

  if (eventDoc.status === EVENT_STATUS.CANCELLED) {
    throw new ApiError(400, "Bookings are not allowed for cancelled events");
  }

  // TODO: Once the Seat Management module exists, add concurrency protection
  // and seat availability checks here (e.g. MongoDB transactions / atomic
  // seat-status updates) to guarantee two customers cannot hold or book the
  // same seat simultaneously, per the assignment's concurrency requirement.

  const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

  const expiresAt = new Date(Date.now() + SEAT_HOLD_TTL_MINUTES * 60 * 1000);

  const booking = await Booking.create({
    user: userId,
    event,
    seats,
    totalAmount,
    status: BOOKING_STATUS.PENDING,
    expiresAt,
  });

  return booking;
};

const getAllBookingsForUser = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("event", "title eventDate startTime endTime")
    .populate("user", "name email role");

  return bookings;
};

const getBookingById = async (bookingId, userId, userRole) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking id");
  }

  const booking = await Booking.findById(bookingId)
    .populate("event", "title eventDate startTime endTime")
    .populate("user", "name email role");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isOwner = booking.user._id.toString() === userId;
  const isAdmin = userRole === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to view this booking");
  }

  return booking;
};

const cancelBooking = async (bookingId, userId, userRole) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking id");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isOwner = booking.user.toString() === userId;
  const isAdmin = userRole === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to cancel this booking");
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new ApiError(400, "Booking is already cancelled");
  }

  booking.status = BOOKING_STATUS.CANCELLED;

  await booking.save();

  // Placeholder for future modular extensions (added without changing this
  // method's signature or the PATCH /bookings/:id/cancel route):
  // 1. Release the booking's seats back to the event's seat map.
  // 2. Check the waitlist for this event/category and promote the next
  //    customer with a time-limited offer.

  return booking;
};

module.exports = {
  createBooking,
  getAllBookingsForUser,
  getBookingById,
  cancelBooking,
};