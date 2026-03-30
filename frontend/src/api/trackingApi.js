import axiosInstance from "./axiosInstance";

export async function addTrackingUpdate(shipmentId, payload) {
  const response = await axiosInstance.post(`/tracking/${shipmentId}`, payload);
  return response.data;
}
