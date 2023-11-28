import { RectResult } from './useRect'

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
