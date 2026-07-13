import axiosInstance from "./axiosInstance";

export const getSeatMapByEvent = async (eventId) => {
  const response = await axiosInstance.get(`/seats/${eventId}`);
  return response.data.data;
};

export const holdSeats = async (eventId, seatIds) => {
  const response = await axiosInstance.post("/seats/hold", { eventId, seatIds });
  return response.data.data;
};