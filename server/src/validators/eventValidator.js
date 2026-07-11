const { body } = require("express-validator");
const mongoose = require("mongoose");
const { EVENT_STATUS_VALUES } = require("../constants/eventStatus");

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createEventValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("venue")
    .notEmpty()
    .withMessage("Venue is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid venue id"),

  body("eventDate")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Event date must be a valid date"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(TIME_REGEX)
    .withMessage("Start time must be in HH:mm format"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(TIME_REGEX)
    .withMessage("End time must be in HH:mm format"),

  body("basePrice")
    .notEmpty()
    .withMessage("Base price is required")
    .isFloat({ min: 0 })
    .withMessage("Base price cannot be negative"),

  body("bannerImage")
    .optional()
    .isURL()
    .withMessage("Banner image must be a valid URL"),
];

const updateEventValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("venue")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid venue id"),

  body("eventDate")
    .optional()
    .isISO8601()
    .withMessage("Event date must be a valid date"),

  body("startTime")
    .optional()
    .matches(TIME_REGEX)
    .withMessage("Start time must be in HH:mm format"),

  body("endTime")
    .optional()
    .matches(TIME_REGEX)
    .withMessage("End time must be in HH:mm format"),

  body("basePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price cannot be negative"),

  body("status")
    .optional()
    .isIn(EVENT_STATUS_VALUES)
    .withMessage(`Status must be one of: ${EVENT_STATUS_VALUES.join(", ")}`),

  body("bannerImage")
    .optional()
    .isURL()
    .withMessage("Banner image must be a valid URL"),
];

module.exports = { createEventValidator, updateEventValidator };