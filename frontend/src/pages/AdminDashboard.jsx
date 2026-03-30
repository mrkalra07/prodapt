import { useCallback, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Table from "../components/Table";
import { assignAgent, getShipments } from "../api/shipmentApi";
import { deleteUser, getAgents, getReports, getUsers } from "../api/adminApi";
import { useFetch } from "../hooks/useFetch";
import { formatDate } from "../utils/formatDate";

function ReportCards({ reports }) {
  return (
    <div className="summary-grid">
      <div className="card summary-card">
        <p className="eyebrow">Users</p>
        <h2>{reports.total_users}</h2>
        <small>{reports.total_customers} customers and {reports.total_agents} agents</small>
      </div>
      <div className="card summary-card">
        <p className="eyebrow">Shipments</p>
        <h2>{reports.total_shipments}</h2>
        <small>{reports.shipments_by_status.in_transit || 0} currently in transit</small>
      </div>
      <div className="card summary-card">
        <p className="eyebrow">Hubs</p>
        <h2>{reports.total_hubs}</h2>
        <small>Configured admin-managed locations</small>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const reportsFetcher = useCallback(() => getReports(), []);
  const usersFetcher = useCallback(() => getUsers(), []);
  const agentsFetcher = useCallback(() => getAgents(), []);
  const shipmentsFetcher = useCallback(() => getShipments(), []);

  const reportsState = useFetch(reportsFetcher, true);
  const usersState = useFetch(usersFetcher, true);
  const agentsState = useFetch(agentsFetcher, true);
  const shipmentsState = useFetch(shipmentsFetcher, true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const agentOptions = agentsState.data?.users || [];
  const shipmentRows = shipmentsState.data?.shipments || [];
  const userRows = usersState.data?.users || [];

  const shipmentColumns = useMemo(
    () => [
      { key: "tracking_number", label: "Tracking Number" },
      { key: "status", label: "Status" },
      { key: "current_location", label: "Current Location" },
      {
        key: "created_at",
        label: "Created",
        render: (row) => formatDate(row.created_at),
      },
      {
        key: "assign",
        label: "Assign Agent",
        render: (row) => (
          <select
            defaultValue={row.assigned_agent || ""}
            onChange={async (event) => {
              const agentId = event.target.value;
              if (!agentId) {
                return;
              }

              setError("");
              setMessage("");

              try {
                await assignAgent(row.id, agentId);
                setMessage(`Assigned agent for ${row.tracking_number}.`);
                await shipmentsState.run();
              } catch (err) {
                setError(err.response?.data?.detail || "Unable to assign agent.");
              }
            }}
          >
            <option value="">Select agent</option>
            {agentOptions.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        ),
      },
    ],
    [agentOptions, shipmentsState]
  );

  const userColumns = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      {
        key: "created_at",
        label: "Created",
        render: (row) => formatDate(row.created_at),
      },
      {
        key: "delete",
        label: "Action",
        render: (row) => (
          <button
            className="button button--danger"
            type="button"
            onClick={async () => {
              setError("");
              setMessage("");

              try {
                const response = await deleteUser(row.id);
                setMessage(response.detail);
                await usersState.run();
              } catch (err) {
                setError(err.response?.data?.detail || "Unable to delete user.");
              }
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    [usersState]
  );

  const loading =
    reportsState.loading || usersState.loading || agentsState.loading || shipmentsState.loading;

  return (
    <Layout>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Admin Console</p>
          <h2>Reports, Users, and Assignment</h2>
        </div>
      </section>

      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {loading ? <Loader /> : null}

      {reportsState.data ? <ReportCards reports={reportsState.data} /> : null}

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shipment Operations</p>
            <h3>Assign Agents</h3>
          </div>
        </div>
        <Table columns={shipmentColumns} rows={shipmentRows} emptyMessage="No shipments available." />
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">User Management</p>
            <h3>Users</h3>
          </div>
        </div>
        <Table columns={userColumns} rows={userRows} emptyMessage="No users found." />
      </section>
    </Layout>
  );
}
