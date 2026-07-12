const express = require("express");
const waitlistController = require("../controllers/waitlistController");
const authenticate = require("../middleware/auth/authenticate");
const authorize = require("../middleware/auth/authorize");
const validateRequest = require("../middleware/validateRequest");
const { joinWaitlistValidator } = require("../validators/waitlistValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.CUSTOMER),
  joinWaitlistValidator,
  validateRequest,
  waitlistController.joinWaitlist
);

router.get("/", authenticate, authorize(ROLES.CUSTOMER), waitlistController.getMyWaitlistEntries);

router.delete("/:id", authenticate, authorize(ROLES.CUSTOMER), waitlistController.leaveWaitlist);

router.post(
  "/offers/:id/accept",
  authenticate,
  authorize(ROLES.CUSTOMER),
  waitlistController.acceptOffer
);

module.exports = router;