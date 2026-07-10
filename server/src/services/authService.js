const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwt");

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({ name, email, password, role });

  const token = generateToken({ userId: user._id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({ userId: user._id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

module.exports = { register, login, getProfile };