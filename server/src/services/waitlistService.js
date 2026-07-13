const mongoose = require("mongoose");
const Waitlist = require("../models/Waitlist");
const WaitlistOffer = require("../models/WaitlistOffer");
const Seat = require("../models/Seat");
const Event = require("../models/Event");
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");
const User = require("../models/User");
const emailService = require("./emailService");
const ApiError = require("../utils/ApiError");
const { WAITLIST_STATUS } = require("../constants/waitlistStatus");
const { SEAT_STATUS } = require("../constants/seatStatus");
const { BOOKING_STATUS } = require("../constants/bookingStatus");
const { EVENT_STATUS } = require("../constants/eventStatus");
const { ROLES } = require("../constants/roles");

const WAITLIST_OFFER_TTL_MINUTES = 10;

const joinWaitlist = async (eventId, category, userId) => {
  const eventDoc = await Event.findById(eventId);

  if (!eventDoc) {
    throw new ApiError(404, "Event not found");
  }

  if (eventDoc.status === EVENT_STATUS.CANCELLED) {
    throw new ApiError(400, "Cannot join a waitlist for a cancelled event");
  }

  const venue = await Venue.findById(eventDoc.venue);

  if (!venue) {
    throw new ApiError(404, "Venue not found for this event");
  }

  const categoryExists = venue.seatCategories.some((cat) => cat.name === category);

  if (!categoryExists) {
    throw new ApiError(400, "Invalid seat category for this event's venue");
  }

  try {
    const waitlistEntry = await Waitlist.create({
      event: eventId,
      category,
      user: userId,
      status: WAITLIST_STATUS.WAITING,
    });

    return waitlistEntry;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "You have already joined this waitlist");
    }

    throw error;
  }
};

const getMyWaitlistEntries = async (userId) => {
  const entries = await Waitlist.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("event", "title eventDate startTime endTime");

  return entries;
};

const leaveWaitlist = async (waitlistId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(waitlistId)) {
    throw new ApiError(400, "Invalid waitlist id");
  }

  const waitlistEntry = await Waitlist.findById(waitlistId);

  if (!waitlistEntry) {
    throw new ApiError(404, "Waitlist entry not found");
  }

  if (waitlistEntry.user.toString() !== userId) {
    throw new ApiError(403, "You do not have permission to leave this waitlist");
  }

  if (waitlistEntry.status !== WAITLIST_STATUS.WAITING) {
    throw new ApiError(
      400,
      "Cannot leave the waitlist once an offer has been made or already resolved"
    );
  }

  waitlistEntry.status = WAITLIST_STATUS.REMOVED;

  await waitlistEntry.save();

  return waitlistEntry;
};

const promoteNextForSeat = async (seat, session) => {
  const nextInLine = await Waitlist.findOneAndUpdate(
    {
      event: seat.event,
      category: seat.category,
      status: WAITLIST_STATUS.WAITING,
    },
    { status: WAITLIST_STATUS.OFFERED },
    { sort: { joinedAt: 1 }, new: true, session }
  );

  if (!nextInLine) {
    return null;
  }

  const updatedSeat = await Seat.findOneAndUpdate(
    { _id: seat._id, status: SEAT_STATUS.BOOKED },
    { status: SEAT_STATUS.HELD },
    { new: true, session }
  );

  if (!updatedSeat) {
    nextInLine.status = WAITLIST_STATUS.WAITING;
    await nextInLine.save({ session });

    return null;
  }

  const expiresAt = new Date(Date.now() + WAITLIST_OFFER_TTL_MINUTES * 60 * 1000);

  let offer;

  try {
    const created = await WaitlistOffer.create(
      [
        {
          waitlist: nextInLine._id,
          event: seat.event,
          seat: seat._id,
          user: nextInLine.user,
          expiresAt,
        },
      ],
      { session }
    );

    offer = created[0];
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "An offer already exists for this waitlist entry");
    }

    throw error;
  }

  const [customer, eventDoc] = await Promise.all([
    User.findById(nextInLine.user).session(session),
    Event.findById(seat.event).session(session),
  ]);

  if (!customer || !eventDoc) {
    throw new ApiError(404, "Customer or event not found while preparing waitlist offer");
  }

  const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const acceptUrl = `${frontendBaseUrl}/waitlist/offers/${offer._id.toString()}/accept`;

  // TODO: Once a scheduler exists, expired offers that never get consumed
  // here should be reconciled proactively (see the standalone TODO near
  // the bottom of this file). No email is sent from inside this function
  // or from within session.withTransaction() — that happens afterward via
  // sendOfferEmailForPromotion(), called only once the enclosing
  // transaction (in bookingService.cancelBooking) has committed.
  return {
    offerId: offer._id.toString(),
    to: customer.email,
    customerName: customer.name,
    eventTitle: eventDoc.title,
    category: seat.category,
    expiresAt,
    acceptUrl,
  };
};

const sendOfferEmailForPromotion = async (promotion) => {
  try {
    await emailService.sendWaitlistOffer({
      to: promotion.to,
      customerName: promotion.customerName,
      eventTitle: promotion.eventTitle,
      category: promotion.category,
      expiresAt: promotion.expiresAt.toLocaleString(),
      acceptUrl: promotion.acceptUrl,
    });
  } catch (error) {
    console.error("Failed to send waitlist offer email:", error);
  }
};

const acceptOffer = async (offerId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(offerId)) {
    throw new ApiError(400, "Invalid offer id");
  }

  const session = await mongoose.startSession();
  let booking;

  try {
    await session.withTransaction(async () => {
      const offer = await WaitlistOffer.findById(offerId).session(session);

      if (!offer) {
        throw new ApiError(404, "Offer not found");
      }

      if (offer.user.toString() !== userId) {
        throw new ApiError(403, "You do not have permission to accept this offer");
      }

      if (offer.expiresAt <= new Date()) {
        throw new ApiError(409, "This offer has expired");
      }

      const eventDoc = await Event.findById(offer.event).session(session);

      if (!eventDoc) {
        throw new ApiError(404, "Event not found");
      }

      if (eventDoc.status === EVENT_STATUS.CANCELLED) {
        throw new ApiError(400, "Cannot accept an offer for a cancelled event");
      }

      const seat = await Seat.findById(offer.seat).session(session);

      if (!seat) {
        throw new ApiError(404, "Seat not found for this offer");
      }

      if (seat.status !== SEAT_STATUS.HELD) {
        throw new ApiError(409, "Seat is no longer held for this offer");
      }

      const seats = [
        {
          row: seat.row,
          column: seat.column,
          category: seat.category,
          price: seat.price,
        },
      ];

      const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

      const seatUpdateResult = await Seat.updateOne(
        { _id: seat._id, status: SEAT_STATUS.HELD },
        { status: SEAT_STATUS.BOOKED },
        { session }
      );

      if (seatUpdateResult.modifiedCount !== 1) {
        throw new ApiError(409, "Seat could not be confirmed, please try again");
      }

      const created = await Booking.create(
        [
          {
            user: userId,
            event: offer.event,
            seats,
            totalAmount,
            status: BOOKING_STATUS.CONFIRMED,
          },
        ],
        { session }
      );

      booking = created[0];

      await WaitlistOffer.deleteOne({ _id: offer._id }, { session });

      await Waitlist.updateOne(
        { _id: offer.waitlist },
        { status: WAITLIST_STATUS.CONVERTED },
        { session }
      );
    });
  } finally {
    session.endSession();
  }

  const [customer, eventDoc] = await Promise.all([
    User.findById(booking.user),
    Event.findById(booking.event),
  ]);

  if (!customer || !eventDoc) {
    return booking;
  }

  const venue = await Venue.findById(eventDoc.venue);

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

// TODO: Introduce a scheduled job (e.g. node-cron) that periodically scans
// for WaitlistOffer documents whose expiresAt has passed but have not yet
// been purged by MongoDB's TTL sweep (which runs on a best-effort ~60s
// cycle). For each such expired offer, the job must, within a transaction:
//   1. Restore the associated Waitlist entry's status back to WAITING
//      (so the customer re-enters the FIFO queue rather than being
//      silently dropped), or REMOVED if a "one missed offer and you're
//      out" policy is preferred (policy decision to be confirmed later).
//   2. Release the offer's HELD seat back to AVAILABLE, or, in the same
//      pass, immediately call promoteNextForSeat() again to offer it to
//      the next eligible WAITING customer instead of leaving it briefly
//      AVAILABLE to the general public.
//   3. Delete the expired WaitlistOffer document (if MongoDB's TTL sweep
//      has not already done so).
// This proactive job is necessary because, absent a new cancellation
// event for the same event/category, an expired offer's seat would
// otherwise remain HELD indefinitely with no automatic promotion.

module.exports = {
  joinWaitlist,
  getMyWaitlistEntries,
  leaveWaitlist,
  promoteNextForSeat,
  sendOfferEmailForPromotion,
  acceptOffer,
};