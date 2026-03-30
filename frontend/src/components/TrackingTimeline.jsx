import { formatDate } from "../utils/formatDate";

export default function TrackingTimeline({ timeline }) {
  if (!timeline) {
    return null;
  }

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Shipment Trail</p>
          <h2>{timeline.tracking_number}</h2>
        </div>
        <div className="timeline-summary">
          <span className={`status-badge status-badge--${timeline.current_status}`}>
            {timeline.current_status}
          </span>
          <small>{timeline.current_location || "Location pending"}</small>
        </div>
      </div>

      <div className="timeline">
        {timeline.updates.length === 0 ? (
          <p className="empty-state">No tracking updates added yet.</p>
        ) : (
          timeline.updates.map((update) => (
            <div className="timeline__item" key={update.id}>
              <div className="timeline__dot" />
              <div className="timeline__content">
                <div className="timeline__row">
                  <strong>{update.location}</strong>
                  <span className={`status-badge status-badge--${update.status}`}>{update.status}</span>
                </div>
                <p>{update.note || "Status updated by assigned agent."}</p>
                <small>{formatDate(update.updated_at)}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
