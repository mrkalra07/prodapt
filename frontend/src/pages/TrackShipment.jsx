import { useState } from "react";
import Layout from "../components/Layout";
import TrackingTimeline from "../components/TrackingTimeline";
import { getShipmentTimeline } from "../api/shipmentApi";

export default function TrackShipment() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [timeline, setTimeline] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await getShipmentTimeline(trackingNumber.trim());
      setTimeline(result);
    } catch (err) {
      setTimeline(null);
      setError(err.response?.data?.detail || "Unable to fetch tracking details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="card form-card">
        <p className="eyebrow">Tracking Search</p>
        <h2>Track Shipment</h2>

        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
          />
          <button className="button" disabled={loading} type="submit">
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error ? <p className="error-text">{error}</p> : null}
      </section>

      <TrackingTimeline timeline={timeline} />
    </Layout>
  );
}
