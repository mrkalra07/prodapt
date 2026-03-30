import axiosInstance from "./axiosInstance";

export async function createShipment(payload) {
  const response = await axiosInstance.post("/shipments", payload);
  return response.data;
}

export async function getShipments() {
  const response = await axiosInstance.get("/shipments");
  return response.data;
}

export async function getAgentShipments() {
  const response = await axiosInstance.get("/agent/shipments");
  return response.data;
}

export async function getShipmentTimeline(trackingNumber) {
  const response = await axiosInstance.get(`/shipments/${trackingNumber}`);
  return response.data;
}

export async function cancelShipment(shipmentId) {
  const response = await axiosInstance.delete(`/shipments/${shipmentId}`);
  return response.data;
}

export async function assignAgent(shipmentId, agentId) {
  const response = await axiosInstance.put(`/shipments/${shipmentId}/assign-agent`, {
    agent_id: agentId,
  });
  return response.data;
}

export async function updateShipmentStatus(shipmentId, payload) {
  const response = await axiosInstance.put(`/shipments/${shipmentId}/status`, payload);
  return response.data;
}
