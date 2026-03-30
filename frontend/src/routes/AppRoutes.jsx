import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AgentDashboard from "../pages/AgentDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateShipment from "../pages/CreateShipment";
import Dashboard from "../pages/Dashboard";
import HubManagement from "../pages/HubManagement";
import Login from "../pages/Login";
import MyShipments from "../pages/MyShipments";
import Register from "../pages/Register";
import TrackShipment from "../pages/TrackShipment";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-shipment"
        element={
          <ProtectedRoute roles={["customer"]}>
            <CreateShipment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-shipments"
        element={
          <ProtectedRoute roles={["customer"]}>
            <MyShipments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent"
        element={
          <ProtectedRoute roles={["agent"]}>
            <AgentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hubs"
        element={
          <ProtectedRoute roles={["admin"]}>
            <HubManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track"
        element={
          <ProtectedRoute roles={["admin", "agent", "customer"]}>
            <TrackShipment />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
