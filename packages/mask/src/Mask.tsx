import React, { MouseEventHandler } from 'react'
import { StylesObj, stylesMatcher } from './styles'
import {
  safe,
  getWindow,
  getPadding,
  RectResult,
} from '@react-explore-kit/utils'

const Mask: React.FC<MaskProps> = ({
  // These are the props the component accepts, with their default values.
  padding = 10,
  wrapperPadding = 0,
  onClick,
  onClickHighlighted,
  styles = {},
  sizes,
  className,
  highlightedAreaClassName,
  maskId,
  clipId,
}) => {
  // Generate unique IDs for the mask and clip if they aren't provided.
  const maskID = maskId || uniqueId('mask__')
  const clipID = clipId || uniqueId('clip__')

  // Get the style matcher for the provided styles.
  const getStyles = stylesMatcher(styles)

  // Calculate padding values from the padding prop.
  const [px, py] = getPadding(padding)
  const [wpx, wpy] = getPadding(wrapperPadding)

  // Get the window dimensions and calculate dimensions for the mask.
  const { w, h } = getWindow()
  const width = safe(sizes?.width + px * 2)
  const height = safe(sizes?.height + py * 2)
  const top = safe(sizes?.top - py - wpy / 2)
  const left = safe(sizes?.left - px - wpx / 2)
  const windowWidth = w - wpx
  const windowHeight = h - wpy

  // Calculate the styles for the area covered by the mask.
  const maskAreaStyles = getStyles('maskArea', {
    x: left,
    y: top,
    width,
    height,
  })

  // Return the JSX for the Mask component.
  return (
    <div
      // Outer wrapper of the mask with a click handler and optional className.
      style={getStyles('maskWrapper', {})}
      onClick={onClick}
      className={className}
    >
      {/* SVG for the mask and highlighted area */}
      <svg
        width={windowWidth}
        height={windowHeight}
        xmlns="http://www.w3.org/2000/svg"
        style={getStyles('svgWrapper', {
          windowWidth,
          windowHeight,
          wpx,
          wpy,
        })}
      >
        {/* Definitions for the SVG (mask and clipPath) */}
        <defs>
          <mask id={maskID}>
            {/* White rectangle covers the whole window */}
            <rect
              x={0}
              y={0}
              width={windowWidth}
              height={windowHeight}
              fill="white"
            />
            {/* Rectangle for the area to be highlighted */}
            <rect
              style={maskAreaStyles}
              // A workaround for Safari to ensure rounded corners.
              rx={maskAreaStyles.rx ? 1 : undefined}
            />
          </mask>
          <clipPath id={clipID}>
            {/* Polygon that represents the clickable area */}
            <polygon points={`...`} />
          </clipPath>
        </defs>

        {/* Rectangle that represents the masked area */}
        <rect
          style={getStyles('maskRect', {
            windowWidth,
            windowHeight,
            maskID,
          })}
        />
        {/* Rectangle that represents the clickable area */}
        <rect
          style={getStyles('clickArea', {
            windowWidth,
            windowHeight,
            top,
            left,
            width,
            height,
            clipID,
          })}
        />
        {/* Rectangle for the highlighted area with a click handler */}
        <rect
          style={getStyles('highlightedArea', {
            x: left,
            y: top,
            width,
            height,
          })}
          className={highlightedAreaClassName}
          onClick={onClickHighlighted}
        />
      </svg>
    </div>
  )
}

export type MaskProps = {
  children?: React.ReactNode
  sizes: RectResult
  styles?: StylesObj
  className?: string
  highlightedAreaClassName?: string
  padding?: number | [number, number]
  wrapperPadding?: number | [number, number]
  onClick?: MouseEventHandler<HTMLDivElement>
  onClickHighlighted?: MouseEventHandler<SVGRectElement>
  maskId?: string
  clipId?: string
}

export default Mask

// Function to generate a unique ID based on a prefix.
function uniqueId(prefix: string) {
  return prefix + Math.random().toString(36).substring(2, 16)
}
