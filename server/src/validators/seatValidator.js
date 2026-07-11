const { body } = require("express-validator");
const mongoose = require("mongoose");

const holdSeatsValidator = [
  body("eventId")
    .notEmpty()
    .withMessage("Event id is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid event id"),

  body("seatIds")
    .notEmpty()
    .withMessage("Seat ids are required")
    .isArray({ min: 1 })
    .withMessage("At least one seat id is required"),

  body("seatIds.*")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid seat id"),
];

module.exports = { holdSeatsValidator };