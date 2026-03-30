import { useState } from "react";
import Layout from "../components/Layout";
import { createShipment } from "../api/shipmentApi";

export default function CreateShipment() {
  const [form, setForm] = useState({ source_address: "", destination_address: "" });
  const [createdShipment, setCreatedShipment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const shipment = await createShipment(form);
      setCreatedShipment(shipment);
      setForm({ source_address: "", destination_address: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create shipment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="card form-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Customer Action</p>
            <h2>Create Shipment</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Source address
            <input
              required
              value={form.source_address}
              onChange={(event) => setForm({ ...form, source_address: event.target.value })}
            />
          </label>

          <label>
            Destination address
            <input
              required
              value={form.destination_address}
              onChange={(event) => setForm({ ...form, destination_address: event.target.value })}
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="button" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </form>
      </section>

      {createdShipment ? (
        <section className="card success-card">
          <p className="eyebrow">Shipment Created</p>
          <h3>{createdShipment.tracking_number}</h3>
          <p className="muted">Keep this tracking number to monitor the delivery timeline.</p>
        </section>
      ) : null}
    </Layout>
  );
}
