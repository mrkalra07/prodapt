import { useCallback, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ShipmentCard from "../components/ShipmentCard";
import { cancelShipment, getShipments } from "../api/shipmentApi";
import { useFetch } from "../hooks/useFetch";

export default function MyShipments() {
  const fetchShipments = useCallback(() => getShipments(), []);
  const { data, loading, error, run } = useFetch(fetchShipments, true);
  const [actionError, setActionError] = useState("");

  async function handleCancel(shipmentId) {
    setActionError("");

    try {
      await cancelShipment(shipmentId);
      await run();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Unable to cancel shipment.");
    }
  }

  return (
    <Layout>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Customer View</p>
          <h2>My Shipments</h2>
        </div>
      </section>

      {error || actionError ? <p className="error-text">{actionError || error}</p> : null}
      {loading ? <Loader /> : null}

      <div className="stack">
        {(data?.shipments || []).map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            action={
              shipment.status === "created" ? (
                <button className="button button--danger" type="button" onClick={() => handleCancel(shipment.id)}>
                  Cancel Shipment
                </button>
              ) : null
            }
          />
        ))}
      </div>
    </Layout>
  );
}
