import React from 'react'
import { useTour } from './Context'

export default function withTour<P>(WrappedComponent: React.ComponentType<P>) {
  // This is the new component that the HOC will return.
  const ComponentWithTour = (props: P) => {
    // Use the custom hook `useTour` to get the tour-related props.
    const tourProps = useTour()

    // Spread the original props and the tour props onto the WrappedComponent.
    // This provides the WrappedComponent access to all of its original props,
    // as well as the props from the Tour context.
    return <WrappedComponent {...props} {...tourProps} />
  }

  // Return the new component that has been enhanced with the tour props.
  return ComponentWithTour
}
