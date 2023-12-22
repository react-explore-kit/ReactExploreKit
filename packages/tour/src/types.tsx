import { ReactNode, Dispatch, ReactElement, ComponentType } from 'react'
import {
  Position,
  PopoverStylesObj,
  PositionProps,
} from '@react-explore-kit/popover'
import { MaskStylesObj } from '@react-explore-kit/mask'
import { RectResult } from '@react-explore-kit/utils'
import { StylesObj } from './styles'
import { PopoverComponentsType } from './components/index'

// SharedProps: Type defining common props used across different components
type SharedProps = KeyboardHandler & {
  steps: StepType[]
  styles?: StylesObj & PopoverStylesObj & MaskStylesObj
  padding?: Padding
  position?: Position
  disableInteraction?:
    | boolean
    | ((
        clickProps: Pick<ClickProps, 'currentStep' | 'steps' | 'meta'>
      ) => boolean)
  disableFocusLock?: boolean
  disableDotsNavigation?: boolean
  disableKeyboardNavigation?: boolean | KeyboardParts[]
  className?: string
  maskClassName?: string
  highlightedMaskClassName?: string
  maskId?: string
  clipId?: string
  nextButton?: (props: BtnFnProps) => ReactNode | null
  prevButton?: (props: BtnFnProps) => ReactNode | null
  afterOpen?: (target: Element | null) => void
  beforeClose?: (target: Element | null) => void
  onClickMask?: (clickProps: ClickProps) => void
  onClickClose?: (clickProps: ClickProps) => void
  onClickHighlighted?: (e: MouseEvent, clickProps: ClickProps) => void
  //  MouseEventHandler<SVGRectElement>
  badgeContent?: (badgeProps: BadgeProps) => any
  showNavigation?: boolean
  showPrevNextButtons?: boolean
  showCloseButton?: boolean
  showBadge?: boolean
  showDots?: boolean
  scrollSmooth?: boolean
  inViewThreshold?: number | { x?: number; y?: number }
  accessibilityOptions?: A11yOptions
  rtl?: boolean
  components?: PopoverComponentsType
  ContentComponent?: ComponentType<PopoverContentProps>
  Wrapper?: ComponentType
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
  setSteps?: Dispatch<React.SetStateAction<StepType[]>>
  showNavigation?: boolean
  showPrevNextButtons?: boolean
  showCloseButton?: boolean
  showBadge?: boolean
  showDots?: boolean
  nextButton?: (props: BtnFnProps) => ReactNode | null
  prevButton?: (props: BtnFnProps) => ReactNode | null
  disableDotsNavigation?: boolean
  rtl?: boolean
  meta?: string
  setMeta?: Dispatch<React.SetStateAction<string>>
}

// A11yOptions: Type defining accessibility options for screen readers
type A11yOptions = {
  ariaLabelledBy?: string
  closeButtonAriaLabel: string
  showNavigationScreenReaders: boolean
}

// Padding: Type defining padding options, either as a number or an object with specific paddings
type ComponentPadding = number | number[]
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
export type ClickProps = {
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  currentStep: number
  steps?: StepType[]
  setSteps?: Dispatch<React.SetStateAction<StepType[]>>
  meta?: string
  setMeta?: Dispatch<React.SetStateAction<string>>
}

export type KeyboardHandler = {
  keyboardHandler?: (
    e: KeyboardEvent,
    clickProps?: ClickProps,
    status?: {
      isEscDisabled?: boolean
      isRightDisabled?: boolean
      isLeftDisabled?: boolean
    }
  ) => void
}

// TourProps: Type extending SharedProps and ClickProps for the main Tour component
export type TourProps = SharedProps &
  ClickProps & {
    isOpen: Boolean
    disabledActions: boolean
    disableWhenSelectorFalsy?: boolean
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
  meta?: string
  setMeta?: Dispatch<React.SetStateAction<string>>
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
  content: ReactElement | string | ((props: PopoverContentProps) => void)
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
  Button: React.FC<React.PropsWithChildren<NavButtonProps>>
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  stepsLength: number
  currentStep: number
  setIsOpen: Dispatch<React.SetStateAction<Boolean>>
  steps?: StepType[]
}

// NavButtonProps: Type defining props for the navigation button components
export type NavButtonProps = {
  onClick?: () => void
  kind?: 'next' | 'prev'
  hideArrow?: boolean
  children?: any
}

export { Position, StylesObj }
