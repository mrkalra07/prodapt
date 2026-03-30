import { useCallback, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ShipmentCard from "../components/ShipmentCard";
import { getAgentShipments, updateShipmentStatus } from "../api/shipmentApi";
import { useFetch } from "../hooks/useFetch";
import { AGENT_STATUSES } from "../utils/constants";

function AgentActionForm({ shipmentId, onSaved }) {
  const [form, setForm] = useState({
    status: AGENT_STATUSES[0],
    location: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStatusUpdate(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateShipmentStatus(shipmentId, form);
      setForm({ status: AGENT_STATUSES[0], location: "", note: "" });
      await onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update shipment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="agent-form" onSubmit={handleStatusUpdate}>
      <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
        {AGENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        required
        placeholder="Current location"
        value={form.location}
        onChange={(event) => setForm({ ...form, location: event.target.value })}
      />
      <input
        placeholder="Optional note"
        value={form.note}
        onChange={(event) => setForm({ ...form, note: event.target.value })}
      />
      <button className="button" disabled={loading} type="submit">
        {loading ? "Saving..." : "Update"}
      </button>
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}

export default function AgentDashboard() {
  const fetchShipments = useCallback(() => getAgentShipments(), []);
  const { data, loading, error, run } = useFetch(fetchShipments, true);

  return (
    <Layout>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Agent Queue</p>
          <h2>Assigned Shipments</h2>
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <Loader /> : null}

      <div className="stack">
        {(data?.shipments || []).map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            action={<AgentActionForm shipmentId={shipment.id} onSaved={run} />}
          />
        ))}
      </div>
    </Layout>
  );
}
