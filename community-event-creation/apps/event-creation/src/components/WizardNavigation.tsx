
interface Props {
  step: number;
  next: () => void;
  back: () => void;
}

export default function WizardNavigation({
  step,
  next,
  back,
}: Props) {
  return (
    <div className="wizard-navigation">
      <button onClick={back} disabled={step === 1}>
        Back
      </button>

      <span>Step {step} of 6</span>

      <button onClick={next}>
        {step === 6 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
