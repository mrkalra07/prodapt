import axiosInstance from "./axiosInstance";

export async function getReports() {
  const response = await axiosInstance.get("/admin/reports");
  return response.data;
}

export async function getUsers() {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
}

export async function deleteUser(userId) {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
}

export async function getAgents() {
  const response = await axiosInstance.get("/users/agents");
  return response.data;
}
