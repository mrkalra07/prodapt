import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { getReports } from "../api/adminApi";
import { getShipments, getAgentShipments } from "../api/shipmentApi";

function SummaryCard({ label, value, hint }) {
  return (
    <div className="card summary-card">
      <p className="eyebrow">{label}</p>
      <h2>{value}</h2>
      <small>{hint}</small>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const isAgent = user.role === "agent";
  const fetcher = isAdmin ? getReports : isAgent ? getAgentShipments : getShipments;
  const { data, loading } = useFetch(fetcher, true);

  let cards = [];

  if (isAdmin && data) {
    cards = [
      { label: "Total Users", value: data.total_users, hint: `${data.total_customers} customers / ${data.total_agents} agents` },
      { label: "Shipments", value: data.total_shipments, hint: `${data.total_hubs} hubs configured` },
      { label: "Delivered", value: data.shipments_by_status.delivered || 0, hint: "Completed shipments" },
    ];
  } else if (data) {
    const shipments = data.shipments || [];
    cards = [
      { label: isAgent ? "Assigned Shipments" : "My Shipments", value: shipments.length, hint: "Visible for your role" },
      {
        label: "In Transit",
        value: shipments.filter((item) => item.status === "in_transit").length,
        hint: "Currently moving between hubs",
      },
      {
        label: "Delivered",
        value: shipments.filter((item) => item.status === "delivered").length,
        hint: "Completed shipments",
      },
    ];
  }

  return (
    <Layout>
      <section className="hero card">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>{user.name}</h2>
          <p className="muted">
            {isAdmin
              ? "Manage hubs, users, and assignments from one place."
              : isAgent
                ? "Update assigned deliveries and keep customers informed."
                : "Create shipments, monitor progress, and track deliveries."}
          </p>
        </div>
        <div className="hero__actions">
          {user.role === "customer" ? <Link className="button" to="/create-shipment">New Shipment</Link> : null}
          {user.role === "agent" ? <Link className="button" to="/agent">Open Agent Queue</Link> : null}
          {user.role === "admin" ? <Link className="button" to="/admin">Open Admin Console</Link> : null}
          <Link className="button button--ghost" to="/track">Track Shipment</Link>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <section className="summary-grid">
          {cards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </section>
      )}
    </Layout>
  );
}
