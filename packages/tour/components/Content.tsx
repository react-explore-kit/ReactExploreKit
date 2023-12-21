import React, { Dispatch } from 'react'

/* 

The component checks if 'content' is a function. If it is, it invokes the function with an object containing all the other props. If 'content' is not a function, it simply returns 'content' as is.

*/

const Content: React.FC<ContentProps> = ({
  content,
  setCurrentStep,
  transition,
  isHighlightingObserved,
  currentStep,
  setIsOpen,
}) => {
  return typeof content === 'function'
    ? content({
        setCurrentStep,
        transition,
        isHighlightingObserved,
        currentStep,
        setIsOpen,
      })
    : content
}

export type ContentProps = {
  content: any // The content to be rendered. It can be of any type.
  setCurrentStep: Dispatch<React.SetStateAction<number>> // A dispatch function to set the current step, expecting a number or a function returning a number.
  setIsOpen?: Dispatch<React.SetStateAction<Boolean>> // An optional dispatch function to set the open/closed state of a modal or similar component.
  currentStep: number // The current step number.
  transition?: boolean // An optional boolean indicating whether a transition is in progress.
  isHighlightingObserved?: boolean // An optional boolean indicating whether the highlighting is observed.
}

export default Content
