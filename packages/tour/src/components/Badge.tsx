import React from 'react'

import { StylesObj, stylesMatcher } from '../styles'

const Badge: React.FC<BadgeProps> = ({ styles = {}, children }) => {
  // Using the `stylesMatcher` function to get a function (`getStyles`)
  // which will return the combined default and custom styles for a given style key.
  const getStyles = stylesMatcher(styles)

  // Render a span with the style for the 'badge' key and display the children inside it.
  return <span style={getStyles('badge', {})}>{children}</span>
}

// Define the properties that the `Badge` component expects.
export type BadgeProps = {
  // This allows users to provide custom styles to override or extend the default ones.
  styles?: StylesObj
  children?: any
}

export default Badge
