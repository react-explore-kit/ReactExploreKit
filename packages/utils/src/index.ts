import Portal from './Portal'
import Observables from './Observables'
import { useRect, useElemRect, RectResult, getRect } from './useRect'
import { smoothScroll } from './smoothScroll'

/**
 * Ensures that a given number is not negative.
 * @param {number} sum - The number to be validated.
 * @returns {number} - Returns 0 if the input number is negative, otherwise returns the input number.
 */
export function safe(sum: number): number {
  // Check if the input number is negative
  if (sum < 0) {
    // If it is negative, return 0
    return 0
  }
  // If it's not negative, return the input number itself
  return sum
}

/**
 * A function to normalize and extract threshold values for X and Y axes.
 * @param {number | {x?: number, y?: number}} threshold - The threshold value(s) for determining in-view status.
 * It can be a single number applied to both axes, or an object with optional x and y properties.
 * @returns {{ thresholdX: number, thresholdY: number }} An object containing threshold values for X and Y axes.
 */

function getInViewThreshold(threshold: InViewArgs['threshold']) {
  // Check if the threshold is an object and not null
  if (typeof threshold === 'object' && threshold !== null) {
    // If it's an object, return an object with thresholdX and thresholdY properties.
    // Use the provided x and y values from the threshold object, falling back to 0 if they are not provided.
    return {
      thresholdX: threshold.x || 0,
      thresholdY: threshold.y || 0,
    }
  }

  // If threshold is not an object, treat it as a single number and apply it to both X and Y axes.
  // If threshold is not provided, fallback to 0.
  return {
    thresholdX: threshold || 0,
    thresholdY: threshold || 0,
  }
}

/**
 * Type definition for the arguments of inView function.
 */

type InViewArgs = RectResult & {
  threshold?: { x?: number; y?: number } | number
}

/**
 * Retrieves the current window's dimensions.
 * @returns {Object} - An object containing the window's width (`w`) and height (`h`).
 */
export function getWindow(): { w: number; h: number } {
  // Get the window's width. Use the maximum value between the document's client width and
  // the window's inner width. If the window's inner width is undefined, default to 0.
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )

  // Get the window's height in a similar way as the width.
  const h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )

  // Return an object containing the window's dimensions.
  return { w, h }
}

/**
 * Determines if an element is in view within the current window, considering specified thresholds.
 * @param {InViewArgs} - An object representing the element's bounding box and optional thresholds.
 * @param {number} top - The top position of the element.
 * @param {number} right - The right position of the element.
 * @param {number} bottom - The bottom position of the element.
 * @param {number} left - The left position of the element.
 * @param {number | {x?: number, y?: number}} [threshold] - Optional thresholds to consider for in-view calculation.
 * @returns {boolean} - True if the element is in view, false otherwise.
 */

export function inView({
  top,
  right,
  bottom,
  left,
  threshold,
}: InViewArgs): boolean {
  // Retrieve the current window's dimensions.
  const { w: windowWidth, h: windowHeight } = getWindow()

  // Calculate the horizontal and vertical thresholds.
  const { thresholdX, thresholdY } = getInViewThreshold(threshold)

  // Determine if the element is in view considering the thresholds.
  return (
    // Case 1: The element is taller than the window and is currently covering the viewport.
    (top < 0 && bottom - top > windowHeight) ||
    // Case 2: The element is fully within the viewport, considering the thresholds.
    (top >= 0 + thresholdY &&
      left >= 0 + thresholdX &&
      bottom <= windowHeight - thresholdY &&
      right <= windowWidth - thresholdX)
  )
}

/**
 * Determines if a given position is horizontal (either 'left' or 'right').
 * @param {string} pos - The position to check.
 * @returns {boolean} - Returns true if the position is 'left' or 'right', otherwise false.
 */
export const isHoriz = (pos: string) => /(left|right)/.test(pos)

/**
 * Determines if a given value exceeds the window's width.
 * This can be used to check if an element is positioned outside of the visible horizontal viewport.
 * @param {number} val - The value to compare, usually representing the horizontal position or dimension of an element.
 * @param {number} windowWidth - The current width of the window or viewport.
 * @returns {boolean} - Returns true if the value is greater than the window's width, indicating that it is positioned outside the X (horizontal) boundary.
 */
export const isOutsideX = (val: number, windowWidth: number): boolean => {
  return val > windowWidth
}

/**
 * Determines if a given value exceeds the window's height.
 * This can be used to check if an element is positioned outside of the visible vertical viewport.
 * @param {number} val - The value to compare, usually representing the vertical position or dimension of an element.
 * @param {number} windowHeight - The current height of the window or viewport.
 * @returns {boolean} - Returns true if the value is greater than the window's height, indicating that it is positioned outside the Y (vertical) boundary.
 */
export const isOutsideY = (val: number, windowHeight: number): boolean => {
  return val > windowHeight
}

/**
 * Determines the best positions based on their associated values, sorting them from highest to lowest value.
 *
 * @param {PositionsObjectType} positions - An object where the keys are position names (as strings) and the values are numbers representing the desirability or suitability of each position.
 * @returns {string[]} - An array of position names sorted in descending order based on their associated values.
 */
export function bestPositionOf(positions: PositionsObjectType): string[] {
  // 1. Convert the positions object into an array of objects, each containing a position name and its associated value.
  const positionsArray = Object.keys(positions).map((p) => {
    return {
      position: p,
      value: positions[p],
    }
  })

  // 2. Sort the array in descending order based on the position values.
  const sortedPositions = positionsArray.sort((a, b) => b.value - a.value)

  // 3. Extract the position names from the sorted array.
  const sortedPositionNames = sortedPositions.map((p) => p.position)

  // 4. Return the sorted position names.
  return sortedPositionNames
}

/**
 * `PositionsObjectType` is a TypeScript type that defines an object type.
 * This object has string keys (representing positions) and number values.
 * For example, an object of this type could look like: { left: 10, top: 20 }.
 */
export type PositionsObjectType = {
  [position: string]: number
}

// Define a default padding value which will be used if no padding is provided
const defaultPadding = 10

/**
 * Calculates padding values based on the input.
 * The function can handle both a single number input or an array with two numbers.
 *
 * @param {number | [number, number]} padding - The padding value(s). This can be a single number, or an array of two numbers.
 * @returns {[number, number]} - An array of two numbers representing the vertical and horizontal padding respectively.
 */
export function getPadding(
  padding: number | [number, number] = defaultPadding
): [number, number] {
  // Check if the padding is provided as an array (meaning separate vertical and horizontal values are provided)
  if (Array.isArray(padding)) {
    // If the first value in the array is defined, use it as the vertical padding
    if (padding[0]) {
      // If the second value is also defined, use it as the horizontal padding
      // If not, use the first value for both vertical and horizontal padding
      return [padding[0], padding[1] ? padding[1] : padding[0]]
    } else {
      // If the first value is not defined, fall back to the default padding for both vertical and horizontal
      return [defaultPadding, defaultPadding]
    }
  }
  // If padding is a single number, use it for both vertical and horizontal padding
  return [padding, padding]
}

/**
 * `CoordType` is a TypeScript type that defines an array of numbers.
 * It can represent a coordinate as a list of numeric values.
 * For example, a point in 2D space could be represented as [10, 20].
 */
export type CoordType = number[]

/**
 * `CoordsObjectType` is a TypeScript type that defines an object type.
 * This object has string keys (representing positions) and values of type `CoordType` (number arrays representing coordinates).
 * For example, an object of this type could look like: { topLeft: [0, 0], bottomRight: [100, 100] }.
 */
export type CoordsObjectType = {
  [position: string]: CoordType
}

export {
  Portal,
  Observables,
  useRect,
  useElemRect,
  RectResult,
  getRect,
  smoothScroll,
}
