import React, { useState, useContext } from 'react'

// Import the main Tour component.
import Tour from './Tour'
import { ProviderProps, TourProps } from './types'

// Define a default state for the TourContext. This state will be used as a fallback if no values are provided.
const defaultState = {
  isOpen: false,
  setIsOpen: () => false,
  currentStep: 0,
  setCurrentStep: () => 0,
  steps: [],
  setSteps: () => [],
  setMeta: () => '',
  disabledActions: false,
  setDisabledActions: () => false,
  components: {},
}

// Create a context for managing the state of the Tour component throughout an application.
const TourContext = React.createContext<TourProps>(defaultState)

// The main provider component that wraps around parts of the app where you want to use the tour.
const TourProvider: React.FC<ProviderProps> = ({
  children,
  defaultOpen = false,
  startAt = 0,
  steps: defaultSteps,
  setCurrentStep: customSetCurrentStep,
  currentStep: customCurrentStep,
  ...props
}) => {
  // State management for the Tour.
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [currentStep, setCurrentStep] = useState(startAt)
  const [steps, setSteps] = useState(defaultSteps)
  const [meta, setMeta] = useState('')
  const [disabledActions, setDisabledActions] = useState(false)

  // If a custom function or current step is provided, use them, otherwise, use the internal state.
  const value = {
    isOpen,
    setIsOpen,
    currentStep: customCurrentStep || currentStep,
    setCurrentStep:
      customSetCurrentStep && typeof customSetCurrentStep === 'function'
        ? customSetCurrentStep
        : setCurrentStep,
    steps,
    setSteps,
    disabledActions,
    setDisabledActions,
    meta,
    setMeta,
    ...props,
  }

  // The TourProvider component wraps its children and provides them access to the Tour's state and functions.
  // It also conditionally renders the Tour component based on the isOpen state.
  return (
    <TourContext.Provider value={value}>
      {children}
      {isOpen ? <Tour {...value} /> : null}
    </TourContext.Provider>
  )
}

// Exporting the provider to be used in the app.
export { TourProvider }

// Default export of the context for use in other components.
export default TourContext

// A custom hook to easily access the Tour's state and functions in any component.
export function useTour() {
  return useContext(TourContext)
}
