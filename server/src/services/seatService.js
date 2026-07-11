const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const SeatHold = require("../models/SeatHold");
const ApiError = require("../utils/ApiError");
const { SEAT_STATUS } = require("../constants/seatStatus");

const SEAT_HOLD_TTL_MINUTES = 10;

const generateSeatsForEvent = async (event, venue) => {
  const { rows, columns, seatCategories } = venue;

  if (!rows || rows < 1 || !columns || columns < 1) {
    throw new ApiError(400, "Venue layout is invalid for seat generation");
  }

  if (!Array.isArray(seatCategories) || seatCategories.length === 0) {
    throw new ApiError(400, "Venue has no seat categories defined");
  }

  const categoryCount = seatCategories.length;
  const baseRowsPerCategory = Math.floor(rows / categoryCount);
  const remainder = rows % categoryCount;

  const rowCategoryMap = [];
  let currentRow = 1;

  for (let i = 0; i < categoryCount; i += 1) {
    const rowsForThisCategory = baseRowsPerCategory + (i < remainder ? 1 : 0);

    for (let r = 0; r < rowsForThisCategory; r += 1) {
      rowCategoryMap[currentRow] = seatCategories[i];
      currentRow += 1;
    }
  }

  const seatDocs = [];

  for (let row = 1; row <= rows; row += 1) {
    const category = rowCategoryMap[row];

    for (let column = 1; column <= columns; column += 1) {
      seatDocs.push({
        event: event._id,
        row,
        column,
        category: category.name,
        price: event.basePrice * category.priceMultiplier,
        status: SEAT_STATUS.AVAILABLE,
      });
    }
  }

  const expectedCount = rows * columns;

  if (seatDocs.length !== expectedCount) {
    throw new ApiError(500, "Seat generation count mismatch with venue capacity");
  }

  await Seat.insertMany(seatDocs);

  return { generatedCount: seatDocs.length };
};

const reconcileStaleHold = async (seatId, session) => {
  const seat = await Seat.findById(seatId).session(session || null);

  if (!seat || seat.status !== SEAT_STATUS.HELD) {
    return;
  }

  const activeHold = await SeatHold.findOne({ seat: seatId }).session(session || null);

  if (!activeHold) {
    await Seat.updateOne(
      { _id: seatId, status: SEAT_STATUS.HELD },
      { status: SEAT_STATUS.AVAILABLE },
      { session: session || undefined }
    );
  }
};

const getSeatMapByEvent = async (eventId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const seats = await Seat.find({ event: eventId }).sort({ row: 1, column: 1 });

  if (!seats || seats.length === 0) {
    throw new ApiError(404, "Seat map not found for this event");
  }

  const heldSeats = seats.filter((seat) => seat.status === SEAT_STATUS.HELD);

  for (const seat of heldSeats) {
    await reconcileStaleHold(seat._id, null);
  }

  if (heldSeats.length > 0) {
    return Seat.find({ event: eventId }).sort({ row: 1, column: 1 });
  }

  return seats;
};

const holdSeats = async (eventId, seatIds, userId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const session = await mongoose.startSession();
  const expiresAt = new Date(Date.now() + SEAT_HOLD_TTL_MINUTES * 60 * 1000);
  let createdHolds = [];

  try {
    await session.withTransaction(async () => {
      createdHolds = [];

      for (const seatId of seatIds) {
        if (!mongoose.Types.ObjectId.isValid(seatId)) {
          throw new ApiError(400, "Invalid seat id");
        }

        await reconcileStaleHold(seatId, session);

        const seat = await Seat.findOneAndUpdate(
          { _id: seatId, event: eventId, status: SEAT_STATUS.AVAILABLE },
          { status: SEAT_STATUS.HELD },
          { new: true, session }
        );

        if (!seat) {
          throw new ApiError(409, "One or more seats are no longer available");
        }

        try {
          const [hold] = await SeatHold.create(
            [{ seat: seatId, event: eventId, user: userId, expiresAt }],
            { session }
          );

          createdHolds.push(hold);
        } catch (error) {
          if (error.code === 11000) {
            throw new ApiError(409, "Seat is already held");
          }

          throw error;
        }
      }
    });
  } finally {
    session.endSession();
  }

  return { seatHolds: createdHolds, expiresAt };
};

module.exports = {
  generateSeatsForEvent,
  getSeatMapByEvent,
  holdSeats,
};