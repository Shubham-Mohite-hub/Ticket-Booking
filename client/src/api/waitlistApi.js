import axiosInstance from "./axiosInstance";

export const joinWaitlist = async (event, category) => {
  const response = await axiosInstance.post("/waitlist", {
    event,
    category,
  });

  return response.data.data;
};

export const getMyWaitlist = async () => {
  const response = await axiosInstance.get("/waitlist");
  return response.data.data;
};