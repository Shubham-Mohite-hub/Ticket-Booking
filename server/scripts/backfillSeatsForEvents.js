require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Event = require("../src/models/Event");
const Venue = require("../src/models/Venue");
const Seat = require("../src/models/Seat");
const seatService = require("../src/services/seatService");

const backfillSeats = async () => {
  await connectDB();
  console.log("✅ MongoDB Connected — starting seat backfill");

  const events = await Event.find();

  let checkedCount = 0;
  let generatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const event of events) {
    checkedCount += 1;

    const existingSeatCount = await Seat.countDocuments({ event: event._id });

    if (existingSeatCount > 0) {
      skippedCount += 1;
      continue;
    }

    try {
      const venue = await Venue.findById(event.venue);

      if (!venue) {
        console.error(
          `❌ Skipping event ${event._id} ("${event.title}") — referenced venue not found`
        );
        failedCount += 1;
        continue;
      }

      const result = await seatService.generateSeatsForEvent(event, venue);

      console.log(
        `✅ Generated ${result.generatedCount} seats for event ${event._id} ("${event.title}")`
      );
      generatedCount += 1;
    } catch (error) {
      console.error(
        `❌ Failed to generate seats for event ${event._id} ("${event.title}"):`,
        error.message
      );
      failedCount += 1;
    }
  }

  console.log("\n--- Backfill Summary ---");
  console.log(`Events checked:      ${checkedCount}`);
  console.log(`Events backfilled:   ${generatedCount}`);
  console.log(`Events skipped (already had seats): ${skippedCount}`);
  console.log(`Events failed:       ${failedCount}`);

  await mongoose.connection.close();
  console.log("MongoDB connection closed. Backfill complete.");
};

backfillSeats().catch((error) => {
  console.error("Backfill script crashed:", error);
  process.exit(1);
});