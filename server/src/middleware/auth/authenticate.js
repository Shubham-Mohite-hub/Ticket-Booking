const ApiError = require("../../utils/ApiError");
const { verifyToken } = require("../../utils/jwt");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token is missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    return next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = authenticate;