import { Dispatch, MouseEventHandler, ReactElement, ComponentType } from 'react'
import {
  Position,
  PopoverStylesObj,
  PositionProps,
} from '@react-explore-kit/popover'
import { MaskStylesObj } from '@react-explore-kit/mask'
import { RectResult } from '@react-explore-kit/utils'
import { PopoverComponentsType } from './components/index'
import { StylesObj } from './styles'

// SharedProps: Type defining common props used across different components
type SharedProps = {
  steps: StepType[]
  styles?: StylesObj & PopoverStylesObj & MaskStylesObj
  padding?: Padding
  position?: Position
  disableInteraction?: boolean
  disableFocusLock?: boolean
  disableDotsNavigation?: boolean
  disableKeyboardNavigation?: boolean | KeyboardParts[]
  className?: string
  maskClassName?: string
  highlightedMaskClassName?: string
  nextButton?: (props: BtnFnProps) => React.ReactNode | null | undefined
  prevButton?: (props: BtnFnProps) => React.ReactNode | null | undefined
  afterOpen?: (target: Element | null) => void
  beforeClose?: (target: Element | null) => void
  onClickMask?: (clickProps: ClickProps) => void
  onClickClose?: (clickProps: ClickProps) => void
  onClickHighlighted?: MouseEventHandler<SVGRectElement>
  badgeContent?: (badgeProps: BadgeProps) => any
  showNavigation?: boolean
  showPrevNextButtons?: boolean
  showCloseButton?: boolean
  showBadge?: boolean
  scrollSmooth?: boolean
  inViewThreshold?: number | { x?: number; y?: number }
  accessibilityOptions?: A11yOptions
  rtl?: boolean
  components?: PopoverComponentsType
  ContentComponent?: ComponentType<PopoverContentProps>
}

// PopoverContentProps: Type defining props for the PopoverContent component
export type PopoverContentProps = {
  styles?: StylesObj & PopoverStylesObj & MaskStylesObj
  badgeContent?: (badgeProps: BadgeProps) => any
  components?: PopoverComponentsType
  accessibilityOptions?: A11yOptions
  disabledActions?: boolean
  onClickClose?: (clickProps: ClickProps) => void
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  currentStep: number
  transition?: boolean
  isHighlightingObserved?: boolean
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
  steps: StepType[]
  showNavigation?: boolean
  showPrevNextButtons?: boolean
  showCloseButton?: boolean
  showBadge?: boolean
  showDots?: boolean
  nextButton?: (props: BtnFnProps) => React.ReactNode | null | undefined
  prevButton?: (props: BtnFnProps) => React.ReactNode | null | undefined
  disableDotsNavigation?: boolean
  rtl?: boolean
}

// A11yOptions: Type defining accessibility options for screen readers
type A11yOptions = {
  ariaLabelledBy?: string
  closeButtonAriaLabel: string
  showNavigationScreenReaders: boolean
}

// Padding: Type defining padding options, either as a number or an object with specific paddings
type ComponentPadding = number | [number, number]
export type Padding =
  | number
  | {
      mask?: ComponentPadding
      popover?: ComponentPadding
      wrapper?: ComponentPadding
    }

// KeyboardParts: Type defining the parts of the keyboard used for navigation
export type KeyboardParts = 'esc' | 'left' | 'right'

// ClickProps: Type defining props for click events, including set state actions and current step
type ClickProps = {
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  currentStep: number
  steps?: StepType[]
}

// TourProps: Type extending SharedProps and ClickProps for the main Tour component
export type TourProps = SharedProps &
  ClickProps & {
    isOpen: Boolean
    setSteps: Dispatch<React.SetStateAction<StepType[]>>
    disabledActions: boolean
    setDisabledActions: Dispatch<React.SetStateAction<boolean>>
    onTransition?: (
      postionsProps: PositionProps,
      prev: RectResult
    ) => 'top' | 'right' | 'bottom' | 'left' | 'center' | [number, number]
  }
// BadgeProps: Type defining props for the Badge component, including total steps and current step
type BadgeProps = {
  totalSteps: number
  currentStep: number
  transition?: boolean
}

// ProviderProps: Type extending SharedProps for the TourProvider component
export type ProviderProps = SharedProps & {
  children: React.ReactNode
  defaultOpen?: Boolean
  startAt?: number
  setCurrentStep?: Dispatch<React.SetStateAction<number>>
  currentStep?: number
}

// ContentProps: Type defining props for content rendering, including set state actions and current step
export type ContentProps = {
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  transition: boolean
  currentStep: number
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
}

// StepType: Type defining a step in the tour guide, including selector, content, position, etc.
export type StepType = {
  selector: string | Element
  content: ReactElement | string | ((props: ContentProps) => void)
  position?: Position
  highlightedSelectors?: string[]
  mutationObservables?: string[]
  resizeObservables?: string[]
  navDotAriaLabel?: string
  stepInteraction?: boolean
  action?: (elem: Element | null) => void
  actionAfter?: (elem: Element | null) => void
  disableActions?: boolean
  padding?: Padding
  bypassElem?: boolean
  styles?: StylesObj & PopoverStylesObj & MaskStylesObj
}

// BtnFnProps: Type defining props for the Next and Previous button functions
export type BtnFnProps = {
  Button: React.FC<NavButtonProps> // React functional component for the navigation button
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  stepsLength: number
  currentStep: number
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
}

// NavButtonProps: Type defining props for the navigation button components
export type NavButtonProps = {
  onClick?: () => void
  kind?: 'next' | 'prev'
  hideArrow?: boolean
  children?: any
}

// Re-exporting Position from '@react-explore-kit/popover'
export { Position }
