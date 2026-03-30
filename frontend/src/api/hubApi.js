import axiosInstance from "./axiosInstance";

export async function getHubs() {
  const response = await axiosInstance.get("/admin/hubs");
  return response.data;
}

export async function createHub(payload) {
  const response = await axiosInstance.post("/admin/hubs", payload);
  return response.data;
}

export async function updateHub(hubId, payload) {
  const response = await axiosInstance.put(`/admin/hubs/${hubId}`, payload);
  return response.data;
}

export async function deleteHub(hubId) {
  const response = await axiosInstance.delete(`/admin/hubs/${hubId}`);
  return response.data;
}
