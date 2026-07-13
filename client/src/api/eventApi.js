import axiosInstance from "./axiosInstance";

export const getAllEvents = async () => {
  const response = await axiosInstance.get("/events");
  return response.data.data;
};

export const getEventById = async (eventId) => {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data.data;
};