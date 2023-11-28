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
