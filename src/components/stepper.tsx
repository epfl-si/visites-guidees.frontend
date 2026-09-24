"use client"

import {
  Stepper as ReuiStepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
} from "@/components/reui/stepper"

const Stepper = ({
  value,
  numberOfSteps,
}: {
  value: number
  numberOfSteps: number
}) => {
  const steps = Array.from({ length: numberOfSteps }, (_, i) => i + 1)

  return (
    <ReuiStepper value={value} className="w-full">
      <StepperNav className="gap-5">
        {steps.map((step) => (
          <StepperItem key={step} step={step} className="flex-1">
            <StepperIndicator className="h-1 w-full rounded-full bg-border data-[state=active]:bg-primary data-[state=completed]:bg-primary">
              <span className="sr-only">{step}</span>
            </StepperIndicator>
          </StepperItem>
        ))}
      </StepperNav>
    </ReuiStepper>
  )
}

export default Stepper
