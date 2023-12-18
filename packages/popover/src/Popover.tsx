import React, { useRef } from 'react'

import {
  useRect,
  isHoriz,
  bestPositionOf,
  isOutsideX,
  isOutsideY,
  PositionsObjectType,
  CoordsObjectType,
  CoordType,
  getWindow,
  getPadding,
  RectResult,
} from '@react-explore-kit/utils'

import { StylesObj, stylesMatcher } from './styles'

const Popover: React.FC<PopoverProps> = ({
  children,
  position: providedPosition = 'bottom',
  padding = 10,
  styles = {},
  sizes,
  refresher,
  ...props
}) => {
  // Refs and state hooks are used to manage component state and interactions.
  const helperRef = useRef(null)
  const positionRef = useRef('')
  const verticalAlignRef = useRef('')
  const horizontalAlignRef = useRef('')

  // Window dimensions are retrieved.
  const { w: windowWidth, h: windowHeight } = getWindow()

  // A function to match styles based on position is defined.
  const getStyles = stylesMatcher(styles)

  // A rect hook is used to get the dimensions of the helper element.
  const helperRect = useRect(helperRef, refresher)
  const { width: helperWidth, height: helperHeight } = helperRect

  // Target positions are extracted from the sizes prop.
  const targetLeft = sizes?.left
  const targetTop = sizes?.top
  const targetRight = sizes?.right
  const targetBottom = sizes?.bottom

  // The provided position is normalized to ensure it is in the correct format.
  const position =
    providedPosition && typeof providedPosition === 'function'
      ? providedPosition(
          {
            width: helperWidth,
            height: helperHeight,
            windowWidth,
            windowHeight,
            top: targetTop,
            left: targetLeft,
            right: targetRight,
            bottom: targetBottom,
            x: sizes.x,
            y: sizes.y,
          },
          helperRect
        )
      : providedPosition

  // Available space in each direction is calculated.
  const available: PositionsObjectType = {
    left: targetLeft,
    right: windowWidth - targetRight,
    top: targetTop,
    bottom: windowHeight - targetBottom,
  }

  // Padding is normalized to ensure it is in the correct format.
  const [px, py] = getPadding(padding)

  // Function to check if the popover can be positioned in a certain direction.
  const couldPositionAt = (position: string) => {
    return (
      available[position] >
      (isHoriz(position) ? helperWidth + px * 2 : helperHeight + py * 2)
    )
  }

  // Function to automatically determine the best position for the popover.
  const autoPosition = (coords: CoordsObjectType): CoordType => {
    const positionsOrder: string[] = bestPositionOf(available)
    for (let j = 0; j < positionsOrder.length; j++) {
      if (couldPositionAt(positionsOrder[j])) {
        positionRef.current = positionsOrder[j]
        return coords[positionsOrder[j]]
      }
    }
    positionRef.current = 'center'
    return coords.center
  }

  // Main function to calculate popover position.
  const pos = (helperPosition: Position) => {
    // If the provided position is an array, it means a custom position is specified.
    if (Array.isArray(helperPosition)) {
      // Check if the custom position is outside the window's X and Y boundaries.
      const isOutX = isOutsideX(helperPosition[0], windowWidth)
      const isOutY = isOutsideY(helperPosition[1], windowHeight)

      // Set the current position to 'custom'.
      positionRef.current = 'custom'

      // Adjust the position to be within the window if it's outside, otherwise use the custom position.
      return [
        isOutX ? windowWidth / 2 - helperWidth / 2 : helperPosition[0],
        isOutY ? windowHeight / 2 - helperHeight / 2 : helperPosition[1],
      ]
    }

    // If the popover would be outside the window on the X axis, adjust its X position.
    const hX = isOutsideX(targetLeft + helperWidth, windowWidth)
      ? targetRight - helperWidth + px
      : targetLeft - px

    // Ensure the X position is not less than the padding.
    const x = hX > px ? hX : px

    // If the popover would be outside the window on the Y axis, adjust its Y position.
    const hY = isOutsideY(targetTop + helperHeight, windowHeight)
      ? targetBottom - helperHeight + py
      : targetTop - py

    // Ensure the Y position is not less than the padding.
    const y = hY > py ? hY : py

    // Determine the vertical alignment based on available space.
    if (isOutsideY(targetTop + helperHeight, windowHeight)) {
      verticalAlignRef.current = 'bottom'
    } else {
      verticalAlignRef.current = 'top'
    }

    // Determine the horizontal alignment based on available space.
    if (isOutsideX(targetLeft + helperWidth, windowWidth)) {
      horizontalAlignRef.current = 'left'
    } else {
      horizontalAlignRef.current = 'right'
    }

    // Define the potential coordinates for each position.
    const coords = {
      top: [x, targetTop - helperHeight - py * 2],
      right: [targetRight + px * 2, y],
      bottom: [x, targetBottom + py * 2],
      left: [targetLeft - helperWidth - px * 2, y],
      center: [
        windowWidth / 2 - helperWidth / 2,
        windowHeight / 2 - helperHeight / 2,
      ],
    }

    // If the desired position is 'center' or it's possible to position the popover there, do it.
    if (helperPosition === 'center' || couldPositionAt(helperPosition)) {
      positionRef.current = helperPosition
      return coords[helperPosition]
    }

    // If the desired position is not possible, find the best alternative.
    return autoPosition(coords)
  }

  // Calculated position is used to set styles for the popover.
  const p = pos(position)

  // The Popover component is rendered with appropriate styles and children.
  return (
    <div
      style={{
        ...getStyles('popover', {
          position: positionRef.current,
          verticalAlign: verticalAlignRef.current,
          horizontalAlign: horizontalAlignRef.current,
        }),
        transform: `translate(${Math.round(p[0])}px, ${Math.round(p[1])}px)`,
      }}
      ref={helperRef}
      {...props}
    >
      {children}
    </div>
  )
}

export default Popover

export type PopoverProps = {
  sizes: RectResult
  children?: React.ReactNode
  position?: PositionType
  padding?: number | [number, number]
  styles?: StylesObj
  className?: string
  refresher?: any
}

export type PositionType =
  | Position
  | ((postionsProps: PositionProps, prevRect: RectResult) => Position)

export type PositionProps = RectResult & {
  windowWidth: number
  windowHeight: number
}

export type Position =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'center'
  | [number, number]

// warning messages  used for debugging.
// const warn = (axis: 'x' | 'y', num: number) => {
//   console.warn(`${axis}:${num} is outside window, falling back to center`)
// }
