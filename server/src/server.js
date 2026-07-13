require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { verifyTransporter } = require("./utils/emailSender");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    await verifyTransporter();
    console.log("✅ SMTP transporter verified successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();