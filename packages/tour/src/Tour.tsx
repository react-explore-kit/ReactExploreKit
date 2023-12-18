import React, { useEffect } from 'react'
import { useSizes } from './hooks'
import { Observables, Portal } from '@react-explore-kit/utils'
import Keyboard from './Keyboard'
import Mask from '@react-explore-kit/mask'
import Popover from '@react-explore-kit/popover'
import { FocusScope } from '@react-aria/focus'
import PopoverContent from './components/PopoverContent'
import { Padding, TourProps } from './types'

const Tour: React.FC<TourProps> = ({
  currentStep,
  setCurrentStep,
  setIsOpen,
  steps = [],
  styles: globalStyles = {},
  scrollSmooth,
  afterOpen,
  beforeClose,
  padding = 10,
  position,
  onClickMask,
  onClickHighlighted,
  className = 'reactour__popover',
  maskClassName = 'reactour__mask',
  highlightedMaskClassName,
  disableInteraction,
  disableFocusLock,
  disableKeyboardNavigation,
  inViewThreshold,
  disabledActions,
  setDisabledActions,
  rtl,
  accessibilityOptions = {
    closeButtonAriaLabel: 'Close Tour',
    showNavigationScreenReaders: true,
  },
  ContentComponent,
  onTransition = () => {
    // const arr: [number, number] = [prev.x, prev.y]
    return 'center'
  },
  ...popoverProps
}) => {
  // Getting the current step's data
  const step = steps[currentStep]
  // If the current step has specific styles, use them. If not, use global styles
  const styles = step?.styles || globalStyles

  // Calling a custom hook `useSizes` to calculate sizes and other relevant data
  const {
    sizes,
    transition,
    observableRefresher,
    isHighlightingObserved,
    target,
  } = useSizes(step, {
    block: 'center',
    behavior: scrollSmooth ? 'smooth' : 'auto',
    inViewThreshold,
  })

  useEffect(() => {
    if (afterOpen && typeof afterOpen === 'function') {
      // After the tour is opened
      afterOpen(target)
    }
    return () => {
      if (beforeClose && typeof beforeClose === 'function') {
        // Before the tour is closed
        beforeClose(target)
      }
    }
  }, [])

  const { maskPadding, popoverPadding, wrapperPadding } = getPadding(
    step?.padding || padding
  )

  // Handling click on the mask layer
  function maskClickHandler() {
    if (!disabledActions) {
      if (onClickMask && typeof onClickMask === 'function') {
        onClickMask({ setCurrentStep, setIsOpen, currentStep, steps })
      } else {
        setIsOpen(false)
      }
    }
  }

  const doDisableInteraction = step?.stepInteraction
    ? !step?.stepInteraction
    : disableInteraction

  // Running side effects when the step changes
  useEffect(() => {
    // If there's an action to be performed for the current step
    if (step?.action && typeof step?.action === 'function') {
      step?.action(target)
    }

    // If the current step requires some actions to be disabled
    if (step?.disableActions !== undefined) {
      setDisabledActions(step?.disableActions)
    }

    return () => {
      // An action to be performed after the current step
      if (step?.actionAfter && typeof step?.actionAfter === 'function') {
        step?.actionAfter(target)
      }
    }
  }, [step])

  const popoverPosition = transition
    ? onTransition
    : step?.position
    ? step?.position
    : position

  return step ? (
    <Portal>
      <FocusManager disabled={disableFocusLock}>
        <Observables
          mutationObservables={step?.mutationObservables}
          resizeObservables={step?.resizeObservables}
          refresh={observableRefresher}
        />

        <Keyboard
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          setIsOpen={setIsOpen}
          stepsLength={steps.length}
          disableKeyboardNavigation={disableKeyboardNavigation}
          disable={disabledActions}
          rtl={rtl}
        />

        <Mask
          sizes={transition ? initialState : sizes}
          onClick={maskClickHandler}
          styles={{
            highlightedArea: (base: any) => ({
              ...base,
              display: doDisableInteraction ? 'block' : 'none',
            }),
            ...styles,
          }}
          padding={transition ? 0 : maskPadding}
          highlightedAreaClassName={highlightedMaskClassName}
          className={maskClassName}
          onClickHighlighted={onClickHighlighted}
          wrapperPadding={wrapperPadding}
        />

        <Popover
          sizes={sizes}
          styles={styles}
          position={popoverPosition}
          padding={popoverPadding}
          aria-labelledby={accessibilityOptions?.ariaLabelledBy}
          className={className}
          refresher={currentStep}
        >
          {ContentComponent ? (
            <ContentComponent
              styles={styles}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              setIsOpen={setIsOpen}
              steps={steps}
              accessibilityOptions={accessibilityOptions}
              disabledActions={disabledActions}
              transition={transition}
              isHighlightingObserved={isHighlightingObserved}
              rtl={rtl}
              {...popoverProps}
            />
          ) : (
            <PopoverContent
              styles={styles}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              setIsOpen={setIsOpen}
              steps={steps}
              accessibilityOptions={accessibilityOptions}
              disabledActions={disabledActions}
              transition={transition}
              isHighlightingObserved={isHighlightingObserved}
              rtl={rtl}
              {...popoverProps}
            />
          )}
        </Popover>
      </FocusManager>
    </Portal>
  ) : null
}

export default Tour

type FocusProps = {
  disabled?: boolean
  children?: any
}

// The FocusManager component is responsible for managing keyboard focus within the tour
const FocusManager: React.FC<FocusProps> = ({ disabled, children }) => {
  // If 'disabled' prop is true, render the children directly without any focus management
  return disabled ? (
    <>{children}</>
  ) : (
    // If 'disabled' prop is false, wrap the children inside a FocusScope to manage focus
    <FocusScope contain autoFocus restoreFocus>
      {children}
    </FocusScope>
    // 'contain' prop ensures that the focus is trapped within the FocusScope
    // 'autoFocus' prop automatically focuses the first focusable element inside the FocusScope
    // 'restoreFocus' prop ensures that focus is restored back to the element that had focus before the FocusScope was mounted, once it is unmounted
  )
}

// The getPadding function is used to handle padding values for different parts of the tour component.
function getPadding(padding?: Padding) {
  // Check if the padding is an object and not null
  if (typeof padding === 'object' && padding !== null) {
    // If it's an object, return an object with padding values for mask, popover, and wrapper
    // The values are taken from the respective properties of the padding object
    // If a specific padding value is not provided, it defaults to undefined
    return {
      maskPadding: padding.mask,
      popoverPadding: padding.popover,
      wrapperPadding: padding.wrapper,
    }
  }
  // If padding is not an object (or is null/undefined), return an object with uniform padding values
  // for mask and popover, and set wrapper padding to 0
  // If padding is not provided (undefined), all padding values will be undefined
  return {
    maskPadding: padding,
    popoverPadding: padding,
    wrapperPadding: 0,
  }
}

const initialState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
}
