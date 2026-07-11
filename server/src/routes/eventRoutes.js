const express = require("express");
const eventController = require("../controllers/eventController");
const authenticate = require("../middleware/auth/authenticate");
const authorize = require("../middleware/auth/authorize");
const validateRequest = require("../middleware/validateRequest");
const { createEventValidator, updateEventValidator } = require("../validators/eventValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN),
  createEventValidator,
  validateRequest,
  eventController.createEvent
);

router.get("/", authenticate, eventController.getAllEvents);

router.get("/:id", authenticate, eventController.getEventById);

router.put(
  "/:id",
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN),
  updateEventValidator,
  validateRequest,
  eventController.updateEvent
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  eventController.deleteEvent
);

module.exports = router;