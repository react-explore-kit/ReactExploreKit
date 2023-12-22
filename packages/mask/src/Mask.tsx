import React, { MouseEventHandler } from 'react'
import { StylesObj, stylesMatcher } from './styles'
import {
  safe,
  getWindow,
  getPadding,
  RectResult,
} from '@react-explore-kit/utils'

const Mask: React.FC<MaskProps> = ({
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
  const [pt, pr, pb, pl] = getPadding(padding)
  const [wpt, wpr, wpb, wpl] = getPadding(wrapperPadding)

  // Get the window dimensions and calculate dimensions for the mask.
  const { w, h } = getWindow()
  const width = safe(sizes?.width + pl + pr)
  const height = safe(sizes?.height + pt + pb)
  const top = safe(sizes?.top - pt - wpt)
  const left = safe(sizes?.left - pl - wpl)
  const windowWidth = w - wpl - wpr
  const windowHeight = h - wpt - wpb

  // Calculate the styles for the area covered by the mask.

  const maskAreaStyles = getStyles('maskArea', {
    x: left,
    y: top,
    width,
    height,
  })

  const highlightedAreaStyles = getStyles('highlightedArea', {
    x: left,
    y: top,
    width,
    height,
  })

  return (
    <div
      style={getStyles('maskWrapper', {})}
      onClick={onClick}
      className={className}
    >
      <svg
        width={windowWidth}
        height={windowHeight}
        xmlns="http://www.w3.org/2000/svg"
        style={getStyles('svgWrapper', {
          windowWidth,
          windowHeight,
          wpt,
          wpl,
        })}
      >
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
            <polygon
              points={`0 0, 0 ${windowHeight}, ${left} ${windowHeight}, ${left} ${top}, ${left +
                width} ${top}, ${left + width} ${top + height}, ${left} ${top +
                height}, ${left} ${windowHeight}, ${windowWidth} ${windowHeight}, ${windowWidth} 0`}
            />
          </clipPath>
        </defs>
        <rect
          style={getStyles('maskRect', {
            windowWidth,
            windowHeight,
            maskID,
          })}
        />
        {/* The clickable area */}
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
        <rect
          style={highlightedAreaStyles}
          className={highlightedAreaClassName}
          onClick={onClickHighlighted}
          rx={highlightedAreaStyles.rx ? 1 : undefined}
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
  padding?: number | number[]
  wrapperPadding?: number | number[]
  onClick?: MouseEventHandler<HTMLDivElement>
  onClickHighlighted?: MouseEventHandler<SVGRectElement>
  maskId?: string
  clipId?: string
}

export default Mask

// Function to generate a unique ID based on a prefix.
function uniqueId(prefix: string) {
  return (
    prefix +
    Math.random()
      .toString(36)
      .substring(2, 16)
  )
}
