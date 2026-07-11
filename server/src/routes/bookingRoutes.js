const express = require("express");
const bookingController = require("../controllers/bookingController");
const authenticate = require("../middleware/auth/authenticate");
const authorize = require("../middleware/auth/authorize");
const validateRequest = require("../middleware/validateRequest");
const { createBookingValidator } = require("../validators/bookingValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.CUSTOMER),
  createBookingValidator,
  validateRequest,
  bookingController.createBooking
);

router.get(
  "/",
  authenticate,
  authorize(ROLES.CUSTOMER),
  bookingController.getAllBookingsForUser
);

router.get("/:id", authenticate, bookingController.getBookingById);

router.patch("/:id/cancel", authenticate, bookingController.cancelBooking);

module.exports = router;