const waitlistService = require("../services/waitlistService");
const ApiResponse = require("../utils/ApiResponse");

const joinWaitlist = async (req, res, next) => {
  try {
    const { event, category } = req.body;
    const userId = req.user.userId;

    const waitlistEntry = await waitlistService.joinWaitlist(event, category, userId);

    return res
      .status(201)
      .json(new ApiResponse(true, "Joined waitlist successfully", waitlistEntry));
  } catch (error) {
    next(error);
  }
};

const getMyWaitlistEntries = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const entries = await waitlistService.getMyWaitlistEntries(userId);

    return res
      .status(200)
      .json(new ApiResponse(true, "Waitlist entries fetched successfully", entries));
  } catch (error) {
    next(error);
  }
};

const leaveWaitlist = async (req, res, next) => {
  try {
    const waitlistId = req.params.id;
    const userId = req.user.userId;

    const waitlistEntry = await waitlistService.leaveWaitlist(waitlistId, userId);

    return res
      .status(200)
      .json(new ApiResponse(true, "Left waitlist successfully", waitlistEntry));
  } catch (error) {
    next(error);
  }
};

const acceptOffer = async (req, res, next) => {
  try {
    const offerId = req.params.id;
    const userId = req.user.userId;

    const booking = await waitlistService.acceptOffer(offerId, userId);

    return res
      .status(201)
      .json(new ApiResponse(true, "Offer accepted, booking confirmed", booking));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  joinWaitlist,
  getMyWaitlistEntries,
  leaveWaitlist,
  acceptOffer,
};