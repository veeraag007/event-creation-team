
import { useState } from "react";
import StepIndicator from "./StepIndicator";
import WizardNavigation from "./WizardNavigation";

import {
  EventFormData,
  initialEventData,
} from "../types/event";

export default function EventWizard() {
  const [step, setStep] = useState(1);

  // Shared state for all event form fields
  const [formData, setFormData] =
    useState<EventFormData>(initialEventData);

  const updateForm = (
    field: keyof EventFormData,
    value: unknown
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const next = () => {
    setStep((previous) => Math.min(previous + 1, 6));
  };

  const back = () => {
    setStep((previous) => Math.max(previous - 1, 1));
  };

  return (
    <div className="wizard-container">

      <h2>Create New Event</h2>

      <StepIndicator currentStep={step} />

      <div className="wizard-content">

        {step === 1 && (
          <>
            <h3>Basic Information</h3>

            <input
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) =>
                updateForm("title", e.target.value)
              }
            />

            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) =>
                updateForm("description", e.target.value)
              }
            />
          </>
        )}

        {step === 2 && (
          <>
            <h3>Category Selection</h3>

            <input
              placeholder="Category ID"
              value={formData.categoryId}
              onChange={(e) =>
                updateForm("categoryId", e.target.value)
              }
            />

            <input
              placeholder="Subcategory"
              value={formData.subcategory}
              onChange={(e) =>
                updateForm("subcategory", e.target.value)
              }
            />
          </>
        )}

        {step === 3 && (
          <>
            <h3>Date and Time</h3>

            <label>Start Date</label>
            <input
              type="datetime-local"
              value={formData.startDateTime}
              onChange={(e) =>
                updateForm("startDateTime", e.target.value)
              }
            />

            <label>End Date</label>
            <input
              type="datetime-local"
              value={formData.endDateTime}
              onChange={(e) =>
                updateForm("endDateTime", e.target.value)
              }
            />
          </>
        )}

        {step === 4 && (
          <>
            <h3>Venue Details</h3>

            <input
              placeholder="Venue Name"
              value={formData.venueName}
              onChange={(e) =>
                updateForm("venueName", e.target.value)
              }
            />

            <input
              placeholder="Venue Address"
              value={formData.venueAddress}
              onChange={(e) =>
                updateForm("venueAddress", e.target.value)
              }
            />

            <input
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                updateForm("city", e.target.value)
              }
            />
          </>
        )}

        {step === 5 && (
          <>
            <h3>Speakers and Media</h3>

            <input
              placeholder="Speaker Name"
              onChange={(e) =>
                updateForm("speakers", [
                  {
                    name: e.target.value,
                    designation: "",
                    bio: "",
                  },
                ])
              }
            />

            <input
              placeholder="Banner Image URL"
              value={formData.bannerUrl}
              onChange={(e) =>
                updateForm("bannerUrl", e.target.value)
              }
            />
          </>
        )}

        {step === 6 && (
          <>
            <h3>Review Event Details</h3>

            <p>Title: {formData.title}</p>
            <p>Description: {formData.description}</p>
            <p>Category: {formData.categoryId}</p>
            <p>Venue: {formData.venueName}</p>
            <p>City: {formData.city}</p>
            <p>Start: {formData.startDateTime}</p>
            <p>End: {formData.endDateTime}</p>
            <p>Banner: {formData.bannerUrl}</p>
          </>
        )}

      </div>

      <WizardNavigation
        step={step}
        next={next}
        back={back}
      />

      <button
        onClick={() =>
          console.log("Event Form Data:", formData)
        }
      >
        Check Form Data
      </button>

    </div>
  );
}
