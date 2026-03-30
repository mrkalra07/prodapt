import { formatDate } from "../utils/formatDate";

export default function ShipmentCard({ shipment, action }) {
  return (
    <article className="card shipment-card">
      <div className="shipment-card__header">
        <div>
          <p className="eyebrow">Tracking Number</p>
          <h3>{shipment.tracking_number}</h3>
        </div>
        <span className={`status-badge status-badge--${shipment.status}`}>{shipment.status}</span>
      </div>

      <div className="shipment-card__grid">
        <div>
          <small>Source</small>
          <p>{shipment.source_address}</p>
        </div>
        <div>
          <small>Destination</small>
          <p>{shipment.destination_address}</p>
        </div>
        <div>
          <small>Current Location</small>
          <p>{shipment.current_location || "-"}</p>
        </div>
        <div>
          <small>Created</small>
          <p>{formatDate(shipment.created_at)}</p>
        </div>
      </div>

      {action ? <div className="shipment-card__actions">{action}</div> : null}
    </article>
  );
}
