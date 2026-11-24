import { useEffect, useState } from "react";
import "./App.css";

type EventStatus = "Draft" | "Published" | "Unpublished" | "Cancelled";

type EventData = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string;
  eventType: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  isOnline: boolean;
  speakerName: string;
  speakerDesignation: string;
  banner: string;
  logo: string;
  ticketType: string;
  ticketPrice: string;
  registrationLink: string;
  status: EventStatus;
};

const emptyEvent: EventData = {
  id: "",
  title: "",
  description: "",
  category: "",
  subcategory: "",
  tags: "",
  eventType: "Offline",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  venueName: "",
  venueAddress: "",
  isOnline: false,
  speakerName: "",
  speakerDesignation: "",
  banner: "",
  logo: "",
  ticketType: "Free",
  ticketPrice: "",
  registrationLink: "",
  status: "Draft",
};

const steps = [
  "Basic Information",
  "Category",
  "Schedule & Venue",
  "Speakers & Media",
  "Review & Publish",
];

function App() {
  const [event, setEvent] = useState<EventData>(emptyEvent);
  const [events, setEvents] = useState<EventData[]>([]);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("communityEvents");

    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("communityEvents", JSON.stringify(events));
  }, [events]);

  const updateField = (field: keyof EventData, value: string | boolean) => {
    setEvent((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const uploadImage = (
    file: File | undefined,
    field: "banner" | "logo"
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField(field, reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (step === 0 && !event.title.trim()) {
      setMessage("Please enter the event title.");
      return;
    }

    if (step === 1 && !event.category) {
      setMessage("Please select an event category.");
      return;
    }

    if (step === 2 && !event.startDate) {
      setMessage("Please select the event start date.");
      return;
    }

    setMessage("");
    setStep((previous) => Math.min(previous + 1, steps.length - 1));
  };

  const previousStep = () => {
    setMessage("");
    setStep((previous) => Math.max(previous - 1, 0));
  };

  const saveDraft = () => {
    const draft: EventData = {
      ...event,
      id: editingId || crypto.randomUUID(),
      status: "Draft",
    };

    if (editingId) {
      setEvents((previous) =>
        previous.map((item) => (item.id === editingId ? draft : item))
      );
    } else {
      setEvents((previous) => [...previous, draft]);
    }

    setEvent(emptyEvent);
    setStep(0);
    setEditingId(null);
    setMessage("Event saved successfully as Draft!");
  };

  const publishEvent = () => {
    if (!event.title.trim()) {
      setMessage("Event title is required.");
      return;
    }

    if (!event.category) {
      setMessage("Please select a category.");
      return;
    }

    if (!event.startDate) {
      setMessage("Event date is required.");
      return;
    }

    const publishedEvent: EventData = {
      ...event,
      id: editingId || crypto.randomUUID(),
      status: "Published",
    };

    if (editingId) {
      setEvents((previous) =>
        previous.map((item) =>
          item.id === editingId ? publishedEvent : item
        )
      );
    } else {
      setEvents((previous) => [...previous, publishedEvent]);
    }

    setEvent(emptyEvent);
    setStep(0);
    setEditingId(null);
    setMessage("Event published successfully!");
  };

  const editEvent = (item: EventData) => {
    setEvent(item);
    setEditingId(item.id);
    setStep(0);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEvent = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");

    if (!confirmed) return;

    setEvents((previous) => previous.filter((item) => item.id !== id));
  };

  const changeStatus = (id: string, status: EventStatus) => {
    setEvents((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const resetForm = () => {
    setEvent(emptyEvent);
    setStep(0);
    setEditingId(null);
    setMessage("");
  };

  const statusClass = (status: EventStatus) =>
    status.toLowerCase().replace(" ", "-");

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h2>Community</h2>
            <p>Admin Portal</p>
          </div>
        </div>

        <div className="sidebar-label">MENU</div>

        <div className="nav-item active">
          <span>▣</span>
          Event Management
        </div>

        <div className="nav-item">
          <span>◷</span>
          Event Lifecycle
        </div>

        <div className="nav-item">
          <span>⚙</span>
          Settings
        </div>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Admin Account</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Admin / Events</span>
            <h1>Event Management</h1>
          </div>

          <button className="primary-button" onClick={resetForm}>
            + Create Event
          </button>
        </header>

        {message && (
          <div className="message">
            <span>✓</span>
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="form-card">
          <div className="form-heading">
            <div>
              <h2>{editingId ? "Edit Event" : "Create New Event"}</h2>
              <p>
                Create, manage and publish community events.
              </p>
            </div>

            <span className="draft-badge">
              {editingId ? "Editing Event" : "New Event"}
            </span>
          </div>

          <div className="stepper">
            {steps.map((stepName, index) => (
              <div
                key={stepName}
                className={`step ${index === step ? "current" : ""} ${
                  index < step ? "completed" : ""
                }`}
              >
                <div className="step-number">
                  {index < step ? "✓" : index + 1}
                </div>

                <span>{stepName}</span>
              </div>
            ))}
          </div>

          <div className="form-content">
            {/* STEP 1 */}
            {step === 0 && (
              <div>
                <div className="section-title">
                  <h3>Basic Information</h3>
                  <p>Enter the basic details of your event.</p>
                </div>

                <div className="field">
                  <label>
                    Event Title <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter event title"
                    value={event.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Event Description</label>

                  <textarea
                    rows={5}
                    placeholder="Describe your event..."
                    value={event.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Event Type</label>

                  <div className="radio-options">
                    {["Offline", "Online", "Hybrid"].map((type) => (
                      <label className="radio-card" key={type}>
                        <input
                          type="radio"
                          name="eventType"
                          checked={event.eventType === type}
                          onChange={() => updateField("eventType", type)}
                        />

                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div>
                <div className="section-title">
                  <h3>Category & Classification</h3>
                  <p>Organize your event so users can discover it.</p>
                </div>

                <div className="field">
                  <label>
                    Category <span>*</span>
                  </label>

                  <select
                    value={event.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option>Technology</option>
                    <option>Education</option>
                    <option>Business</option>
                    <option>Community</option>
                    <option>Culture</option>
                    <option>Sports</option>
                    <option>Entertainment</option>
                    <option>Health</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="field">
                  <label>Subcategory</label>

                  <input
                    type="text"
                    placeholder="Enter subcategory"
                    value={event.subcategory}
                    onChange={(e) =>
                      updateField("subcategory", e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Tags</label>

                  <input
                    type="text"
                    placeholder="Example: workshop, networking, AI"
                    value={event.tags}
                    onChange={(e) => updateField("tags", e.target.value)}
                  />

                  <small>Separate tags using commas.</small>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 2 && (
              <div>
                <div className="section-title">
                  <h3>Schedule & Venue</h3>
                  <p>Configure the event date, time and location.</p>
                </div>

                <div className="two-column">
                  <div className="field">
                    <label>
                      Start Date <span>*</span>
                    </label>

                    <input
                      type="date"
                      value={event.startDate}
                      onChange={(e) =>
                        updateField("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>End Date</label>

                    <input
                      type="date"
                      value={event.endDate}
                      onChange={(e) =>
                        updateField("endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Start Time</label>

                    <input
                      type="time"
                      value={event.startTime}
                      onChange={(e) =>
                        updateField("startTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>End Time</label>

                    <input
                      type="time"
                      value={event.endTime}
                      onChange={(e) =>
                        updateField("endTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Venue Name</label>

                  <input
                    type="text"
                    placeholder="Enter venue name"
                    value={event.venueName}
                    onChange={(e) =>
                      updateField("venueName", e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Venue Address</label>

                  <textarea
                    rows={3}
                    placeholder="Enter complete address"
                    value={event.venueAddress}
                    onChange={(e) =>
                      updateField("venueAddress", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 3 && (
              <div>
                <div className="section-title">
                  <h3>Speakers & Media</h3>
                  <p>Add speaker information and event images.</p>
                </div>

                <div className="two-column">
                  <div className="field">
                    <label>Speaker Name</label>

                    <input
                      type="text"
                      placeholder="Speaker name"
                      value={event.speakerName}
                      onChange={(e) =>
                        updateField("speakerName", e.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Speaker Designation</label>

                    <input
                      type="text"
                      placeholder="Speaker role/designation"
                      value={event.speakerDesignation}
                      onChange={(e) =>
                        updateField("speakerDesignation", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Event Banner</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      uploadImage(e.target.files?.[0], "banner")
                    }
                  />

                  {event.banner && (
                    <div className="image-preview">
                      <img src={event.banner} alt="Event banner preview" />

                      <button
                        className="remove-image"
                        onClick={() => updateField("banner", "")}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="field">
                  <label>Event Logo</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      uploadImage(e.target.files?.[0], "logo")
                    }
                  />

                  {event.logo && (
                    <div className="logo-preview">
                      <img src={event.logo} alt="Event logo preview" />

                      <button
                        className="remove-image"
                        onClick={() => updateField("logo", "")}
                      >
                        Remove Logo
                      </button>
                    </div>
                  )}
                </div>

                <div className="field">
                  <label>Registration / Ticket Type</label>

                  <select
                    value={event.ticketType}
                    onChange={(e) =>
                      updateField("ticketType", e.target.value)
                    }
                  >
                    <option>Free</option>
                    <option>Paid</option>
                    <option>Registration Required</option>
                  </select>
                </div>

                {event.ticketType === "Paid" && (
                  <div className="field">
                    <label>Ticket Price</label>

                    <input
                      type="number"
                      min="0"
                      placeholder="Enter price"
                      value={event.ticketPrice}
                      onChange={(e) =>
                        updateField("ticketPrice", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="field">
                  <label>Registration Link</label>

                  <input
                    type="url"
                    placeholder="https://example.com/register"
                    value={event.registrationLink}
                    onChange={(e) =>
                      updateField("registrationLink", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 4 && (
              <div>
                <div className="section-title">
                  <h3>Review Event</h3>
                  <p>Check all details before publishing.</p>
                </div>

                {event.banner && (
                  <div className="review-banner">
                    <img src={event.banner} alt="Event banner" />
                  </div>
                )}

                <div className="review-card">
                  <h2>{event.title || "Untitled Event"}</h2>

                  <p>{event.description || "No description added."}</p>

                  <div className="review-grid">
                    <div>
                      <span>Category</span>
                      <strong>{event.category || "Not selected"}</strong>
                    </div>

                    <div>
                      <span>Subcategory</span>
                      <strong>{event.subcategory || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Event Type</span>
                      <strong>{event.eventType}</strong>
                    </div>

                    <div>
                      <span>Date</span>
                      <strong>{event.startDate || "Not selected"}</strong>
                    </div>

                    <div>
                      <span>Time</span>
                      <strong>
                        {event.startTime || "--:--"} - {event.endTime || "--:--"}
                      </strong>
                    </div>

                    <div>
                      <span>Venue</span>
                      <strong>{event.venueName || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Speaker</span>
                      <strong>{event.speakerName || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Ticket Type</span>
                      <strong>{event.ticketType}</strong>
                    </div>
                  </div>

                  {event.venueAddress && (
                    <div className="review-extra">
                      <strong>Address</strong>
                      <p>{event.venueAddress}</p>
                    </div>
                  )}

                  {event.tags && (
                    <div className="review-extra">
                      <strong>Tags</strong>
                      <p>{event.tags}</p>
                    </div>
                  )}

                  {event.registrationLink && (
                    <div className="review-extra">
                      <strong>Registration Link</strong>
                      <p>{event.registrationLink}</p>
                    </div>
                  )}
                </div>

                <div className="publish-note">
                  <strong>Ready to publish?</strong>

                  <p>
                    Publishing makes this event available in the published
                    events list. You can unpublish it later.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="form-footer">
            <button className="secondary-button" onClick={saveDraft}>
              Save as Draft
            </button>

            <div className="footer-right">
              {step > 0 && (
                <button className="secondary-button" onClick={previousStep}>
                  ← Previous
                </button>
              )}

              {step < steps.length - 1 ? (
                <button className="primary-button" onClick={nextStep}>
                  Next →
                </button>
              ) : (
                <button className="publish-button" onClick={publishEvent}>
                  ✓ Publish Event
                </button>
              )}
            </div>
          </div>
        </section>

        {/* EVENT LIST */}
        <section className="events-section">
          <div className="events-heading">
            <div>
              <h2>Manage Events</h2>
              <p>View and manage the events you have created.</p>
            </div>

            <div className="event-count">
              {events.length} Event{events.length !== 1 ? "s" : ""}
            </div>
          </div>

          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▣</div>
              <h3>No events created yet</h3>
              <p>Your created events will appear here.</p>
            </div>
          ) : (
            <div className="event-list">
              {events.map((item) => (
                <div className="event-item" key={item.id}>
                  <div className="event-thumbnail">
                    {item.banner ? (
                      <img src={item.banner} alt={item.title} />
                    ) : (
                      <span>▣</span>
                    )}
                  </div>

                  <div className="event-info">
                    <h3>{item.title}</h3>
                    <p>
                      {item.category || "Uncategorized"} ·{" "}
                      {item.startDate || "Date not set"}
                    </p>
                  </div>

                  <span className={`status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>

                  <div className="event-actions">
                    <button onClick={() => editEvent(item)}>Edit</button>

                    {item.status === "Published" && (
                      <button
                        onClick={() => changeStatus(item.id, "Unpublished")}
                      >
                        Unpublish
                      </button>
                    )}

                    {item.status === "Unpublished" && (
                      <button
                        onClick={() => changeStatus(item.id, "Published")}
                      >
                        Publish
                      </button>
                    )}

                    {item.status !== "Cancelled" && (
                      <button
                        onClick={() => changeStatus(item.id, "Cancelled")}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      className="delete-button"
                      onClick={() => deleteEvent(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer>
          Community Event Admin Portal · Event Lifecycle Management
        </footer>
      </main>
    </div>
  );
}

export default App;