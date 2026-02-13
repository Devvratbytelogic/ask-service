"use client";

export interface ProgressStepBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

const ProgressStepBar = ({
  currentStep,
  totalSteps,
  stepLabels,
  className = "",
}: ProgressStepBarProps) => {
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      {/* Horizontal bar: rounded track, green fill */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {stepLabels && stepLabels.length > 0 && (
        <div className="mt-2 flex justify-between">
          {stepLabels.map((label, index) => (
            <span
              key={`step-label-${index}`}
              className={`text-xs max-w-16 truncate text-center ${
                index < currentStep ? "text-emerald-600 font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressStepBar;
