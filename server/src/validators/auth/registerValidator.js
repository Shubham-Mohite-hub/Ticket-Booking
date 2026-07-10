const { body } = require("express-validator");
const { ROLE_VALUES } = require("../../constants/roles");

const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(ROLE_VALUES)
    .withMessage(`Role must be one of: ${ROLE_VALUES.join(", ")}`),
];

module.exports = registerValidator;