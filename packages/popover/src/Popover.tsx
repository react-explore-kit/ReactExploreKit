import React, { useRef } from 'react'

import {
  useRect,
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
  const [pt, pr, pb, pl] = getPadding(padding)

  // Function to check if the popover can be positioned in a certain direction.
  const couldPositionAt = (
    position: string,
    isOutsideX: boolean,
    isOutsideY: boolean
  ) => {
    switch (position) {
      case 'top':
        return available.top > helperHeight + pb
      case 'right':
        return isOutsideX ? false : available.right > helperWidth + pl
      case 'bottom':
        return isOutsideY ? false : available.bottom > helperHeight + pt
      case 'left':
        return available.left > helperWidth + pr

      default:
        return false
    }
  }

  // Function to automatically determine the best position for the popover.
  const autoPosition = (
    coords: CoordsObjectType,
    outX: boolean,
    outY: boolean
  ): CoordType => {
    // if (outY && outX) {
    //   positionRef.current = 'center'
    //   return coords.center
    // }
    const positionsOrder: string[] = bestPositionOf(
      available,
      outY ? ['right', 'left'] : outX ? ['top', 'bottom'] : []
    )
    for (let j = 0; j < positionsOrder.length; j++) {
      if (couldPositionAt(positionsOrder[j], outX, outY)) {
        positionRef.current = positionsOrder[j]
        return coords[positionsOrder[j]]
      }
    }
    positionRef.current = 'center'
    return coords.center
  }

  // Main function to calculate popover position.
  const pos = (helperPosition: Position) => {
    if (Array.isArray(helperPosition)) {
      const isOutX = isOutsideX(helperPosition[0], windowWidth)
      const isOutY = isOutsideY(helperPosition[1], windowHeight)

      positionRef.current = 'custom'
      return [
        isOutX ? windowWidth / 2 - helperWidth / 2 : helperPosition[0],
        isOutY ? windowHeight / 2 - helperHeight / 2 : helperPosition[1],
      ]
    }

    const isHelperOutsideX = isOutsideX(targetLeft + helperWidth, windowWidth)
    const isHelperOutsideY = isOutsideY(
      targetBottom + helperHeight,
      windowHeight
    )

    const x = isHelperOutsideX
      ? Math.min(targetLeft, windowWidth - helperWidth)
      : Math.max(targetLeft, 0)

    const y = isHelperOutsideY
      ? helperHeight > available.bottom
        ? Math.max(targetBottom - helperHeight, 0)
        : Math.max(targetTop, 0)
      : targetTop

    if (isHelperOutsideY) {
      if (helperHeight > available.bottom) {
        verticalAlignRef.current = 'bottom'
      } else {
        verticalAlignRef.current = 'top'
      }
    } else {
      verticalAlignRef.current = 'top'
    }
    if (isHelperOutsideX) {
      horizontalAlignRef.current = 'left'
    } else {
      horizontalAlignRef.current = 'right'
    }

    const coords = {
      top: [x - pl, targetTop - helperHeight - pb],
      right: [targetRight + pl, y - pt],
      bottom: [x - pl, targetBottom + pt],
      left: [targetLeft - helperWidth - pr, y - pt],
      center: [
        windowWidth / 2 - helperWidth / 2,
        windowHeight / 2 - helperHeight / 2,
      ],
    }
    if (
      helperPosition === 'center' ||
      (couldPositionAt(helperPosition, isHelperOutsideX, isHelperOutsideY) &&
        !isHelperOutsideX &&
        !isHelperOutsideY)
    ) {
      positionRef.current = helperPosition
      return coords[helperPosition]
    }

    return autoPosition(coords, isHelperOutsideX, isHelperOutsideY)
  }

  // Calculated position is used to set styles for the popover.
  const p = pos(position)

  return (
    <div
      className="react-explore-kit__popover"
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
  padding?: number | number[]
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
