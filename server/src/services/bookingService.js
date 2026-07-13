const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Seat = require("../models/Seat");
const SeatHold = require("../models/SeatHold");
const Venue = require("../models/Venue");
const User = require("../models/User");
const waitlistService = require("./waitlistService");
const emailService = require("./emailService");
const ApiError = require("../utils/ApiError");
const { BOOKING_STATUS } = require("../constants/bookingStatus");
const { EVENT_STATUS } = require("../constants/eventStatus");
const { SEAT_STATUS } = require("../constants/seatStatus");
const { ROLES } = require("../constants/roles");

const createBooking = async (bookingData, userId) => {
  const { event, seatHoldIds } = bookingData;

  const eventDoc = await Event.findById(event);

  if (!eventDoc) {
    throw new ApiError(404, "Event not found");
  }

  if (eventDoc.status === EVENT_STATUS.CANCELLED) {
    throw new ApiError(400, "Bookings are not allowed for cancelled events");
  }

  const session = await mongoose.startSession();
  let booking;

  try {
    await session.withTransaction(async () => {
      const seats = [];
      const seatIdsToConfirm = [];
      const now = new Date();

      for (const seatHoldId of seatHoldIds) {
        if (!mongoose.Types.ObjectId.isValid(seatHoldId)) {
          throw new ApiError(400, "Invalid seat hold id");
        }

        const hold = await SeatHold.findOne({
          _id: seatHoldId,
          user: userId,
          event,
        }).session(session);

        if (!hold) {
          throw new ApiError(404, "Seat hold not found or does not belong to you");
        }

        if (hold.expiresAt <= now) {
          throw new ApiError(409, "Seat hold has expired, please select seats again");
        }

        const seat = await Seat.findById(hold.seat).session(session);

        if (!seat) {
          throw new ApiError(404, "Seat not found for the given hold");
        }

        if (seat.status !== SEAT_STATUS.HELD) {
          throw new ApiError(409, "One or more seats are no longer held and cannot be confirmed");
        }

        seats.push({
          row: seat.row,
          column: seat.column,
          category: seat.category,
          price: seat.price,
        });

        seatIdsToConfirm.push(seat._id);
      }

      const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

      const updateResult = await Seat.updateMany(
        { _id: { $in: seatIdsToConfirm }, status: SEAT_STATUS.HELD },
        { status: SEAT_STATUS.BOOKED },
        { session }
      );

      if (updateResult.modifiedCount !== seatIdsToConfirm.length) {
        throw new ApiError(409, "One or more seats could not be confirmed, please try again");
      }

      await SeatHold.deleteMany({ _id: { $in: seatHoldIds } }, { session });

      const created = await Booking.create(
        [
          {
            user: userId,
            event,
            seats,
            totalAmount,
            status: BOOKING_STATUS.CONFIRMED,
          },
        ],
        { session }
      );

      booking = created[0];
    });
  } finally {
    session.endSession();
  }

  const [customer, venue] = await Promise.all([
    User.findById(userId),
    Venue.findById(eventDoc.venue),
  ]);

  await emailService.sendBookingConfirmation({
    to: customer.email,
    bookingId: booking._id.toString(),
    eventTitle: eventDoc.title,
    eventDate: eventDoc.eventDate.toDateString(),
    eventTime: eventDoc.startTime,
    venueName: venue ? venue.name : "N/A",
    customerName: customer.name,
    seats: booking.seats,
    totalAmount: booking.totalAmount,
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

  const session = await mongoose.startSession();
  let booking;
  const promotions = [];

  try {
    await session.withTransaction(async () => {
      booking = await Booking.findById(bookingId).session(session);

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

      const seatsToReleaseToAvailable = [];

      for (const bookedSeat of booking.seats) {
        const seatDoc = await Seat.findOne({
          event: booking.event,
          row: bookedSeat.row,
          column: bookedSeat.column,
        }).session(session);

        if (!seatDoc) {
          throw new ApiError(409, "Seat record not found during cancellation");
        }

        const promotion = await waitlistService.promoteNextForSeat(seatDoc, session);

        if (promotion) {
          promotions.push(promotion);
        } else {
          seatsToReleaseToAvailable.push(seatDoc._id);
        }
      }

      if (seatsToReleaseToAvailable.length > 0) {
        const seatUpdateResult = await Seat.updateMany(
          {
            _id: { $in: seatsToReleaseToAvailable },
            status: SEAT_STATUS.BOOKED,
          },
          { status: SEAT_STATUS.AVAILABLE },
          { session }
        );

        if (seatUpdateResult.modifiedCount !== seatsToReleaseToAvailable.length) {
          throw new ApiError(
            409,
            "One or more seats could not be released, please try again"
          );
        }
      }

      booking.status = BOOKING_STATUS.CANCELLED;

      await booking.save({ session });
    });
  } finally {
    session.endSession();
  }

  for (const promotion of promotions) {
    try {
      await waitlistService.sendOfferEmailForPromotion(promotion);
    } catch (error) {
      console.error("Failed to send waitlist offer email during cancellation:", error);
    }
  }

  return booking;
};

module.exports = {
  createBooking,
  getAllBookingsForUser,
  getBookingById,
  cancelBooking,
};