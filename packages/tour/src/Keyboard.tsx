import React, { Dispatch, useEffect } from 'react'
import { KeyboardParts } from './types'

const Keyboard: React.FC<KeyboardProps> = ({
  disableKeyboardNavigation,
  setCurrentStep,
  currentStep,
  setIsOpen,
  stepsLength,
  disable,
  rtl,
}) => {
  // Function to handle the keydown event
  function keyDownHandler(e: any) {
    // Stopping the event from propagating up to parent elements
    e.stopPropagation()

    // If keyboard navigation is completely disabled or the `disable` prop is true, exit the function
    if (disableKeyboardNavigation === true || disable) {
      return
    }

    // Initializing variables to check if specific keys are disabled
    let isEscDisabled, isRightDisabled, isLeftDisabled
    // If `disableKeyboardNavigation` is an array, check if specific keys are disabled
    if (disableKeyboardNavigation) {
      isEscDisabled = disableKeyboardNavigation.includes('esc')
      isRightDisabled = disableKeyboardNavigation.includes('right')
      isLeftDisabled = disableKeyboardNavigation.includes('left')
    }

    // Function to go to the next step
    function next() {
      setCurrentStep(Math.min(currentStep + 1, stepsLength - 1))
    }

    // Function to go to the previous step
    function prev() {
      setCurrentStep(Math.max(currentStep - 1, 0))
    }

    // Handle 'Esc' key press
    if (e.keyCode === 27 && !isEscDisabled) {
      e.preventDefault()
      setIsOpen(false)
    }
    // Handle 'Right Arrow' key press
    if (e.keyCode === 39 && !isRightDisabled) {
      e.preventDefault()
      rtl ? prev() : next()
    }
    // Handle 'Left Arrow' key press
    if (e.keyCode === 37 && !isLeftDisabled) {
      e.preventDefault()
      rtl ? next() : prev()
    }
  }

  // Adding the keydown event listener when the component mounts
  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler, false)
    // Cleaning up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [disable, setCurrentStep, currentStep])

  // As this component is only for handling keyboard events, it doesn't render anything to the DOM
  return null
}

// Defining the prop types for the Keyboard component
export type KeyboardProps = {
  disableKeyboardNavigation?: boolean | KeyboardParts[]
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  currentStep: number
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
  stepsLength: number
  disable?: boolean
  rtl?: boolean
}

// Exporting the Keyboard component as the default export
export default Keyboard
