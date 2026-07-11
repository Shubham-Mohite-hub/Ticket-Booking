const express = require("express");
const seatController = require("../controllers/seatController");
const authenticate = require("../middleware/auth/authenticate");
const authorize = require("../middleware/auth/authorize");
const validateRequest = require("../middleware/validateRequest");
const { holdSeatsValidator } = require("../validators/seatValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.get("/:eventId", authenticate, seatController.getSeatMapByEvent);

router.post(
  "/hold",
  authenticate,
  authorize(ROLES.CUSTOMER),
  holdSeatsValidator,
  validateRequest,
  seatController.holdSeats
);

module.exports = router;