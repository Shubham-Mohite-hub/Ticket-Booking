require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { verifyTransporter } = require("./utils/emailSender");
const { startScheduler } = require("./jobs/scheduler");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);

      try {
        await verifyTransporter();
        console.log("✅ SMTP transporter verified successfully");
      } catch (err) {
        console.error("SMTP verification failed:", err.message);
      }

      startScheduler();
    });

  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
};

startServer();