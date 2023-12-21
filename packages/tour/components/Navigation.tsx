import React, {
  ReactNode,
  Dispatch,
  ComponentType,
  // PropsWithChildren,
} from 'react'
import { StylesObj, stylesMatcher } from '../styles'
import { StepType, BtnFnProps, NavButtonProps } from '../types'

const Navigation: React.FC<NavigationProps> = ({
  styles = {},
  steps,
  setCurrentStep,
  currentStep,
  setIsOpen,
  nextButton,
  prevButton,
  disableDots,
  hideDots,
  hideButtons,
  disableAll,
  rtl,
  Arrow = DefaultArrow,
}) => {
  // Gets the total number of steps.
  const stepsLength = steps.length

  // This function matches styles passed to the component with default styles.
  const getStyles = stylesMatcher(styles)

  // Internal component `Button` handles rendering of navigation buttons (Next & Previous).
  const Button: React.FC<NavButtonProps> = ({
    onClick,
    kind = 'next',
    children,
    hideArrow,
  }) => {
    // Handles the click event for the navigation buttons.
    function clickHandler() {
      // If all interactions are not disabled
      if (!disableAll) {
        // If a custom onClick is provided and is a function, execute it
        if (onClick && typeof onClick === 'function') {
          onClick()
        } else {
          // Otherwise, adjust the current step either incrementing or decrementing based on the `kind`.
          if (kind === 'next') {
            setCurrentStep(Math.min(currentStep + 1, stepsLength - 1))
          } else {
            setCurrentStep(Math.max(currentStep - 1, 0))
          }
        }
      }
    }

    // Returns the button JSX, with either an Arrow icon or custom children, based on the props.
    return (
      <button
        style={getStyles('button', {
          kind,
          disabled: disableAll
            ? disableAll
            : kind === 'next'
            ? stepsLength - 1 === currentStep
            : currentStep === 0,
        })}
        onClick={clickHandler}
        aria-label={`Go to ${kind} step`}
      >
        {/* Show arrow if it's not hidden */}
        {!hideArrow ? (
          <Arrow
            styles={styles}
            inverted={rtl ? kind === 'prev' : kind === 'next'}
            disabled={
              disableAll
                ? disableAll
                : kind === 'next'
                ? stepsLength - 1 === currentStep
                : currentStep === 0
            }
          />
        ) : null}
        {children}
      </button>
    )
  }

  // The main render of the Navigation component
  return (
    <div style={getStyles('controls', {})} dir={rtl ? 'rtl' : 'ltr'}>
      {!hideButtons ? (
        prevButton && typeof prevButton === 'function' ? (
          prevButton({
            Button,
            setCurrentStep,
            currentStep,
            stepsLength,
            setIsOpen,
            steps,
          })
        ) : (
          <Button kind="prev" />
        )
      ) : null}

      {!hideDots && (
        <div style={getStyles('navigation', {})}>
          {Array.from({ length: stepsLength }, (_, i) => i).map(index => {
            return (
              <button
                style={getStyles('dot', {
                  current: index === currentStep,
                  disabled: disableDots || disableAll,
                })}
                onClick={() => {
                  if (!disableDots && !disableAll) setCurrentStep(index)
                }}
                key={`navigation_dot_${index}`}
                aria-label={
                  steps[index]?.navDotAriaLabel || `Go to step ${index + 1}`
                }
              />
            )
          })}
        </div>
      )}

      {!hideButtons ? (
        nextButton && typeof nextButton === 'function' ? (
          nextButton({
            Button,
            setCurrentStep,
            currentStep,
            stepsLength,
            setIsOpen,
            steps,
          })
        ) : (
          <Button />
        )
      ) : null}
    </div>
  )
}

type BaseProps = {
  styles?: StylesObj
}

export type NavigationProps = BaseProps & {
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  steps: StepType[]
  currentStep: number
  disableDots?: boolean
  nextButton?: (props: BtnFnProps) => ReactNode | null
  prevButton?: (props: BtnFnProps) => ReactNode | null
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
  hideButtons?: boolean
  hideDots?: boolean
  disableAll?: boolean
  rtl?: boolean
  Arrow?: ComponentType<ArrowProps>
}

export default Navigation

export type ArrowProps = BaseProps & {
  inverted?: Boolean
  disabled?: Boolean
}

export const DefaultArrow: React.FC<ArrowProps> = ({
  styles = {},
  inverted = false,
  disabled,
}) => {
  const getStyles = stylesMatcher(styles)
  return (
    <svg
      viewBox="0 0 18.4 14.4"
      style={getStyles('arrow', { inverted, disabled })}
    >
      <path
        d={
          inverted
            ? 'M17 7.2H1M10.8 1L17 7.2l-6.2 6.2'
            : 'M1.4 7.2h16M7.6 1L1.4 7.2l6.2 6.2'
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
    </svg>
  )
}
