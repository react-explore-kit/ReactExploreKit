import React, { Dispatch, useEffect } from 'react'
import { KeyboardParts, ClickProps, KeyboardHandler } from './types'

// Keyboard component that handles keyboard interactions for navigation
const Keyboard: React.FC<KeyboardProps> = ({
  disableKeyboardNavigation,
  setCurrentStep,
  currentStep,
  setIsOpen,
  stepsLength,
  disable,
  rtl,
  clickProps,
  keyboardHandler, // Custom keyboard event handler function
}) => {
  // Handler for keyboard events
  function keyDownHandler(e: any) {
    e.stopPropagation() // Prevent event bubbling

    // Return early if keyboard navigation is disabled
    if (disableKeyboardNavigation === true || disable) {
      return
    }

    // Flags to check if specific keys are disabled
    let isEscDisabled, isRightDisabled, isLeftDisabled
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

    // Custom keyboard handler
    if (keyboardHandler && typeof keyboardHandler === 'function') {
      keyboardHandler(e, clickProps, {
        isEscDisabled,
        isRightDisabled,
        isLeftDisabled,
      })
    } else {
      // Default keyboard handling for Esc, Right Arrow, and Left Arrow keys
      if (e.keyCode === 27 && !isEscDisabled) {
        // Esc key
        e.preventDefault()
        setIsOpen(false)
      }
      if (e.keyCode === 39 && !isRightDisabled) {
        // Right Arrow key
        e.preventDefault()
        if (rtl) {
          prev()
        } else {
          next()
        }
      }
      if (e.keyCode === 37 && !isLeftDisabled) {
        // Left Arrow key
        e.preventDefault()
        if (rtl) {
          next()
        } else {
          prev()
        }
      }
    }
  }

  // useEffect hook to attach and clean up the keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler, false)
    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [disable, setCurrentStep, currentStep])

  // Component doesn't render anything (null), it's just for handling keyboard events
  return null
}

// Type definitions for the props of Keyboard component
export type KeyboardProps = KeyboardHandler & {
  disableKeyboardNavigation?: boolean | KeyboardParts[] // Prop to disable keyboard navigation partially or entirely
  setCurrentStep: Dispatch<React.SetStateAction<number>> // Function to set the current step in a process or flow
  currentStep: number // Current step index
  setIsOpen: Dispatch<React.SetStateAction<Boolean>> // Function to control the open state of a modal or similar component
  stepsLength: number // Total number of steps
  disable?: boolean // Prop to disable the keyboard functionality entirely
  rtl?: boolean // Right-to-left language support flag
  clickProps?: ClickProps // Props related to click events, can be passed to custom keyboard handlers
}

export default Keyboard
