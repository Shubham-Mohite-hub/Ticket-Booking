const { body } = require("express-validator");
const mongoose = require("mongoose");

const joinWaitlistValidator = [
  body("event")
    .notEmpty()
    .withMessage("Event is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid event id"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
];

module.exports = { joinWaitlistValidator };