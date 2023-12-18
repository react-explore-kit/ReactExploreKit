import React from 'react'
import { defaultComponents } from './index'
import { PopoverContentProps } from '../types'

const PopoverContent: React.FC<PopoverContentProps> = ({
  styles,
  components = {},
  badgeContent,
  accessibilityOptions,
  disabledActions,
  onClickClose,
  steps,
  setCurrentStep,
  currentStep,
  transition,
  isHighlightingObserved,
  setIsOpen,
  nextButton,
  prevButton,
  disableDotsNavigation,
  rtl,
  showPrevNextButtons = true,
  showCloseButton = true,
  showNavigation = true,
  showBadge = true,
  showDots = true,
}) => {
  // Getting the current step object based on the currentStep index.
  const step = steps[currentStep]
  // Merging default components with any custom components provided through props.
  const { Badge, Close, Content, Navigation, Arrow } =
    defaultComponents(components)

  // Handling badge content, it could be a function or a simple value.
  const badge =
    badgeContent && typeof badgeContent === 'function'
      ? badgeContent({
          currentStep,
          totalSteps: steps.length,
          transition,
        })
      : currentStep + 1

  // Handling click event on the close button.
  function closeClickHandler() {
    if (!disabledActions) {
      if (onClickClose && typeof onClickClose === 'function') {
        onClickClose({ setCurrentStep, setIsOpen, currentStep })
      } else {
        setIsOpen(false)
      }
    }
  }

  // Rendering the popover content.
  return (
    <React.Fragment>
      {/* Rendering the badge, if enabled. */}
      {showBadge ? <Badge styles={styles}>{badge}</Badge> : null}
      {/* Rendering the close button, if enabled. */}
      {showCloseButton ? (
        <Close
          styles={styles}
          aria-label={accessibilityOptions?.closeButtonAriaLabel}
          disabled={disabledActions}
          onClick={closeClickHandler}
        />
      ) : null}
      {/* Rendering the main content. */}
      <Content
        content={step?.content}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        transition={transition}
        isHighlightingObserved={isHighlightingObserved}
        setIsOpen={setIsOpen}
      />
      {/* Rendering the navigation controls, if enabled. */}
      {showNavigation ? (
        <Navigation
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          setIsOpen={setIsOpen}
          steps={steps}
          styles={styles}
          aria-hidden={!accessibilityOptions?.showNavigationScreenReaders}
          nextButton={nextButton}
          prevButton={prevButton}
          disableDots={disableDotsNavigation}
          hideButtons={!showPrevNextButtons}
          hideDots={!showDots}
          disableAll={disabledActions}
          rtl={rtl}
          Arrow={Arrow}
        />
      ) : null}
    </React.Fragment>
  )
}

export default PopoverContent
