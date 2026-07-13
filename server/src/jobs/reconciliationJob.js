const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const SeatHold = require("../models/SeatHold");
const Waitlist = require("../models/Waitlist");
const WaitlistOffer = require("../models/WaitlistOffer");
const waitlistService = require("../services/waitlistService");
const { SEAT_STATUS } = require("../constants/seatStatus");
const { WAITLIST_STATUS } = require("../constants/waitlistStatus");

const expireWaitlistOffers = async () => {
  const now = new Date();

  const expiredOffers = await WaitlistOffer.find({ expiresAt: { $lte: now } });

  let processedCount = 0;

  for (const expiredOffer of expiredOffers) {
    const session = await mongoose.startSession();
    let promotion = null;

    try {
      await session.withTransaction(async () => {
        const offer = await WaitlistOffer.findById(expiredOffer._id).session(session);

        if (!offer) {
          return;
        }

        const waitlistEntry = await Waitlist.findById(offer.waitlist).session(session);

        if (waitlistEntry && waitlistEntry.status === WAITLIST_STATUS.OFFERED) {
          waitlistEntry.status = WAITLIST_STATUS.WAITING;
          await waitlistEntry.save({ session });
        }

        const seat = await Seat.findById(offer.seat).session(session);

        if (seat && seat.status === SEAT_STATUS.HELD) {
          promotion = await waitlistService.promoteNextForSeat(
            seat,
            session,
            SEAT_STATUS.HELD
          );

          if (!promotion) {
            await Seat.updateOne(
              { _id: seat._id, status: SEAT_STATUS.HELD },
              { status: SEAT_STATUS.AVAILABLE },
              { session }
            );
          }
        }

        await WaitlistOffer.deleteOne({ _id: offer._id }, { session });
      });

      processedCount += 1;
    } catch (error) {
      console.error("Error processing expired waitlist offer:", error);
    } finally {
      session.endSession();
    }

    if (promotion) {
      await waitlistService.sendOfferEmailForPromotion(promotion);
    }
  }

  console.log(`Expired waitlist offers processed: ${processedCount}`);
};

const reconcileOrphanedHeldSeats = async () => {
  const heldSeats = await Seat.find({ status: SEAT_STATUS.HELD });

  let reconciledCount = 0;

  for (const heldSeat of heldSeats) {
    const activeHold = await SeatHold.findOne({ seat: heldSeat._id });
    const activeOffer = await WaitlistOffer.findOne({ seat: heldSeat._id });

    if (activeHold || activeOffer) {
      continue;
    }

    const session = await mongoose.startSession();
    let promotion = null;

    try {
      await session.withTransaction(async () => {
        const seat = await Seat.findById(heldSeat._id).session(session);

        if (!seat || seat.status !== SEAT_STATUS.HELD) {
          return;
        }

        promotion = await waitlistService.promoteNextForSeat(seat, session, SEAT_STATUS.HELD);

        if (!promotion) {
          await Seat.updateOne(
            { _id: seat._id, status: SEAT_STATUS.HELD },
            { status: SEAT_STATUS.AVAILABLE },
            { session }
          );
        }
      });

      reconciledCount += 1;
    } catch (error) {
      console.error("Error reconciling orphaned held seat:", error);
    } finally {
      session.endSession();
    }

    if (promotion) {
      await waitlistService.sendOfferEmailForPromotion(promotion);
    }
  }

  console.log(`Orphan held seats reconciled: ${reconciledCount}`);
};

module.exports = { expireWaitlistOffers, reconcileOrphanedHeldSeats };