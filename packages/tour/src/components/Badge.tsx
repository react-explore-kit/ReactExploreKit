import React from 'react'

import { StylesObj, stylesMatcher } from '../styles'

const Badge: React.FC<BadgeProps> = ({ styles = {}, children }) => {
  const getStyles = stylesMatcher(styles)

  return <span style={getStyles('badge', {})}>{children}</span>
}

export type BadgeProps = {
  // This allows users to provide custom styles to override or extend the default ones.
  styles?: StylesObj
  children?: any
}

export default Badge
