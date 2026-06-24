import {
  StepperContainer,
  StepperItem,
  StepperLabel,
  StepperNode,
  StepperRail,
  StepperTrack,
} from "./AppStepper.styles";

export const AppStepper = ({
  className,
  items = [],
  currentStep = 0,
  ariaLabel = "Progreso",
}) => {
  const lastStepIndex = Math.max(items.length - 1, 0);
  const resolvedCurrentStep = Math.min(Math.max(currentStep, 0), lastStepIndex);

  return (
    <StepperContainer
      className={className}
      role="list"
      aria-label={ariaLabel}
      $stepsCount={items.length}
    >
      <StepperRail aria-hidden="true">
        <StepperTrack $progress={lastStepIndex === 0 ? 1 : resolvedCurrentStep / lastStepIndex} />
      </StepperRail>

      {items.map((item, index) => {
        const isActive = index === resolvedCurrentStep;
        const isCompleted = index < resolvedCurrentStep;

        return (
          <StepperItem key={item.id ?? item.title} role="listitem">
            <StepperNode
              $isActive={isActive}
              $isCompleted={isCompleted}
              aria-current={isActive ? "step" : undefined}
            >
              {index + 1}
            </StepperNode>
            <StepperLabel $isActive={isActive}>{item.title}</StepperLabel>
          </StepperItem>
        );
      })}
    </StepperContainer>
  );
};
