import axiosInstance from "./axiosInstance";

export const createBooking = async (event, seatHoldIds) => {
  const response = await axiosInstance.post("/bookings", {
    event,
    seatHoldIds,
  });

  return response.data.data;
};

export const getMyBookings = async () => {
  const response = await axiosInstance.get("/bookings");
  return response.data.data;
};

export const getBookingById = async (bookingId) => {
  const response = await axiosInstance.get(`/bookings/${bookingId}`);
  return response.data.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axiosInstance.patch(
    `/bookings/${bookingId}/cancel`
  );

  return response.data.data;
};