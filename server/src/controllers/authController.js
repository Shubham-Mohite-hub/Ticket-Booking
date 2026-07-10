const authService = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.register({ name, email, password, role });

    return res
      .status(201)
      .json(new ApiResponse(true, "Registration successful", result));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return res
      .status(200)
      .json(new ApiResponse(true, "Login successful", result));
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await authService.getProfile(userId);

    return res
      .status(200)
      .json(new ApiResponse(true, "Profile fetched successfully", result));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };