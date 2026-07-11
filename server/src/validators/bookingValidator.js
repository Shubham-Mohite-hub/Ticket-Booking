const { body } = require("express-validator");
const mongoose = require("mongoose");

const createBookingValidator = [
  body("event")
    .notEmpty()
    .withMessage("Event is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid event id"),

  body("seats")
    .notEmpty()
    .withMessage("Seats are required")
    .isArray({ min: 1 })
    .withMessage("At least one seat is required"),

  body("seats.*.row")
    .notEmpty()
    .withMessage("Seat row is required")
    .isInt({ min: 1 })
    .withMessage("Seat row must be an integer greater than or equal to 1"),

  body("seats.*.column")
    .notEmpty()
    .withMessage("Seat column is required")
    .isInt({ min: 1 })
    .withMessage("Seat column must be an integer greater than or equal to 1"),

  body("seats.*.category")
    .trim()
    .notEmpty()
    .withMessage("Seat category is required"),

  body("seats.*.price")
    .notEmpty()
    .withMessage("Seat price is required")
    .isFloat({ min: 0 })
    .withMessage("Seat price must be a number greater than or equal to 0"),
];

module.exports = { createBookingValidator };