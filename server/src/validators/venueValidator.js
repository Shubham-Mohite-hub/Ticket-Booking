const { body } = require("express-validator");

const createVenueValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Venue name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("rows")
    .notEmpty()
    .withMessage("Rows is required")
    .isInt({ min: 1 })
    .withMessage("Rows must be at least 1"),

  body("columns")
    .notEmpty()
    .withMessage("Columns is required")
    .isInt({ min: 1 })
    .withMessage("Columns must be at least 1"),

  body("seatCategories")
    .notEmpty()
    .withMessage("Seat categories are required")
    .isArray({ min: 1 })
    .withMessage("At least one seat category is required"),

  body("seatCategories.*.name")
    .trim()
    .notEmpty()
    .withMessage("Seat category name is required"),

  body("seatCategories.*.color")
    .trim()
    .notEmpty()
    .withMessage("Seat category color is required"),

  body("seatCategories.*.priceMultiplier")
    .notEmpty()
    .withMessage("Price multiplier is required")
    .isFloat({ gt: 0 })
    .withMessage("Price multiplier must be greater than zero"),
];

const updateVenueValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("rows")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Rows must be at least 1"),

  body("columns")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Columns must be at least 1"),

  body("seatCategories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one seat category is required"),

  body("seatCategories.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Seat category name is required"),

  body("seatCategories.*.color")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Seat category color is required"),

  body("seatCategories.*.priceMultiplier")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price multiplier must be greater than zero"),
];

module.exports = { createVenueValidator, updateVenueValidator };