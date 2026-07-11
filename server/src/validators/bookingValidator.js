const { body } = require("express-validator");
const mongoose = require("mongoose");

const createBookingValidator = [
  body("event")
    .notEmpty()
    .withMessage("Event is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid event id"),

  body("seatHoldIds")
    .notEmpty()
    .withMessage("Seat hold ids are required")
    .isArray({ min: 1 })
    .withMessage("At least one seat hold id is required"),

  body("seatHoldIds.*")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid seat hold id"),
];

module.exports = { createBookingValidator };