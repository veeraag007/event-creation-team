
import { useParams, Link } from "react-router-dom";

export default function EventPreview() {
  const { id } = useParams();

  return (
    <div className="page-container">

      <h2>Event Preview</h2>

      <p>Event ID: {id}</p>

      <div className="preview-card">
        <h3>Event Details</h3>

        <p>Event information will appear here.</p>
      </div>

      <Link to={`/events/${id}/edit`}>
        <button>Edit Event</button>
      </Link>

    </div>
  );
}
