import React, { useEffect } from 'react'
import { useSizes } from './hooks'
import { Observables } from '@react-explore-kit/utils'
import Keyboard from './Keyboard'
import Mask from '@react-explore-kit/mask'
import Popover from '@react-explore-kit/popover'
import PopoverContent from './components/PopoverContent'
import { Padding, TourProps } from './types'

const Tour: React.FC<TourProps> = ({
  currentStep,
  setCurrentStep,
  setIsOpen,
  steps = [],
  setSteps,
  styles: globalStyles = {},
  scrollSmooth,
  afterOpen,
  beforeClose,
  padding = 10,
  position,
  onClickMask,
  onClickHighlighted,
  keyboardHandler,
  className = 'react-explore-kit__popover',
  maskClassName = 'react-explore-kit__mask',
  highlightedMaskClassName,
  clipId,
  maskId,
  disableInteraction,
  // disableFocusLock,
  disableKeyboardNavigation,
  inViewThreshold,
  disabledActions,
  setDisabledActions,
  disableWhenSelectorFalsy,
  rtl,
  accessibilityOptions = {
    closeButtonAriaLabel: 'Close Tour',
    showNavigationScreenReaders: true,
  },
  ContentComponent,
  Wrapper,
  meta,
  setMeta,
  onTransition = () => {
    // const arr: [number, number] = [prev.x, prev.y]
    return 'center'
  },
  ...popoverProps
}) => {
  // Getting the current step's data
  const step = steps[currentStep]

  const styles = { ...globalStyles, ...step?.styles }

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
    step?.padding ?? padding
  )

  const clickProps = {
    setCurrentStep,
    setIsOpen,
    currentStep,
    setSteps,
    steps,
    setMeta,
    meta,
  }

  // Handling click on the mask layer
  function maskClickHandler() {
    if (!disabledActions) {
      if (onClickMask && typeof onClickMask === 'function') {
        onClickMask(clickProps)
      } else {
        setIsOpen(false)
      }
    }
  }

  const doDisableInteraction =
    typeof step?.stepInteraction === 'boolean'
      ? !step?.stepInteraction
      : disableInteraction
      ? typeof disableInteraction === 'boolean'
        ? disableInteraction
        : disableInteraction(clickProps)
      : false

  useEffect(() => {
    if (step?.action && typeof step?.action === 'function') {
      step?.action(target)
    }

    if (step?.disableActions !== undefined) {
      setDisabledActions(step?.disableActions)
    }

    return () => {
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

  const TourWrapper = Wrapper ? Wrapper : React.Fragment

  return step ? (
    <TourWrapper>
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
        clickProps={clickProps}
        keyboardHandler={keyboardHandler}
      />
      {(!disableWhenSelectorFalsy || target) && (
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
          onClickHighlighted={e => {
            e.preventDefault()
            e.stopPropagation()
            if (onClickHighlighted)
              onClickHighlighted((e as unknown) as MouseEvent, clickProps)
          }}
          wrapperPadding={wrapperPadding}
          clipId={clipId}
          maskId={maskId}
        />
      )}
      {(!disableWhenSelectorFalsy || target) && (
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
              setSteps={setSteps}
              accessibilityOptions={accessibilityOptions}
              disabledActions={disabledActions}
              transition={transition}
              isHighlightingObserved={isHighlightingObserved}
              rtl={rtl}
              meta={meta}
              setMeta={setMeta}
              {...popoverProps}
            />
          )}
        </Popover>
      )}
    </TourWrapper>
  ) : null
}

export default Tour

export interface CustomCSS extends React.CSSProperties {
  rx: number
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
