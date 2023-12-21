import { ComponentType } from 'react'
import Badge, { BadgeProps } from './Badge'
import Close, { CloseProps } from './Close'
import Content, { ContentProps } from './Content'
import Navigation, {
  NavigationProps,
  DefaultArrow as Arrow,
  ArrowProps,
} from './Navigation'

// Defining a type that describes the shape of the popover components.
export interface PopoverComponents {
  Badge: ComponentType<BadgeProps>
  Close: ComponentType<CloseProps>
  Content: ComponentType<ContentProps>
  Navigation: ComponentType<NavigationProps>
  Arrow: ComponentType<ArrowProps>
}

// Creating a type that allows partial definitions of the PopoverComponents.
export type PopoverComponentsType = Partial<PopoverComponents>

// Defining default implementations of the popover components.
export const components = {
  Badge,
  Close,
  Content,
  Navigation,
  Arrow,
}

// Type for the generic popover components.
export type PopoverComponentGeneric = typeof components

// A function that returns a combination of default and custom components.
export const defaultComponents = (
  comps: PopoverComponentsType
): PopoverComponentGeneric =>
  ({
    ...components, // Spread the default components
    ...comps, // Overwrite with custom components if provided
  } as PopoverComponentGeneric)
