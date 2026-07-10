const express = require("express");
const venueController = require("../controllers/venueController");
const authenticate = require("../middleware/auth/authenticate");
const authorize = require("../middleware/auth/authorize");
const validateRequest = require("../middleware/validateRequest");
const { createVenueValidator, updateVenueValidator } = require("../validators/venueValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  createVenueValidator,
  validateRequest,
  venueController.createVenue
);

router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER),
  venueController.getAllVenues
);

router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER),
  venueController.getVenueById
);

router.put(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  updateVenueValidator,
  validateRequest,
  venueController.updateVenue
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  venueController.deleteVenue
);

module.exports = router;