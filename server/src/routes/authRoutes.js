const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/auth/authenticate");
const validateRequest = require("../middleware/validateRequest");
const registerValidator = require("../validators/auth/registerValidator");
const loginValidator = require("../validators/auth/loginValidator");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, authController.register);

router.post("/login", loginValidator, validateRequest, authController.login);

router.get("/profile", authenticate, authController.getProfile);

module.exports = router;