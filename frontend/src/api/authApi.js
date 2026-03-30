import axiosInstance from "./axiosInstance";

export async function login(payload) {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
}

export async function register(payload) {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
}

export async function getProfile() {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
}
