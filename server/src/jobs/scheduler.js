const cron = require("node-cron");
const { expireWaitlistOffers, reconcileOrphanedHeldSeats } = require("./reconciliationJob");

let isRunning = false;

const runReconciliationCycle = async () => {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    await expireWaitlistOffers();
    await reconcileOrphanedHeldSeats();
  } catch (error) {
    console.error("Scheduler reconciliation cycle failed:", error);
  } finally {
    isRunning = false;
  }
};

const startScheduler = () => {
  runReconciliationCycle();

  const job = cron.schedule("* * * * *", runReconciliationCycle);

  console.log("Scheduler started (runs every minute)");

  return job;
};

module.exports = { startScheduler };