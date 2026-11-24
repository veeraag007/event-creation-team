
import { useParams } from "react-router-dom";
import EventWizard from "../components/EventWizard";

export default function EventEdit() {
  const { id } = useParams();

  return (
    <div className="page-container">
      <h2>Edit Event</h2>

      <p>Editing Event ID: {id}</p>

      <EventWizard />
    </div>
  );
}
