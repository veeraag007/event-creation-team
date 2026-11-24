
interface Props {
  currentStep: number;
}

const stepNames = [
  "Basic Information",
  "Category",
  "Schedule",
  "Venue",
  "Speakers & Media",
  "Review",
];

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="stepper">
      <h3>Step {currentStep} of 6</h3>

      <div className="step-list">
        {stepNames.map((name, index) => (
          <div
            key={name}
            className={
              index + 1 <= currentStep ? "step active" : "step"
            }
          >
            <span>{index + 1}</span>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
