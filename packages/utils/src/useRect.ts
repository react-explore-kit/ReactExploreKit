// Import necessary hooks from React
import { useEffect, useCallback, useState } from 'react'

/**
 * A utility function to get the DOMRect of an HTML element.
 * @param element - The HTML element to get the DOMRect for.
 * @returns A RectResult object representing the dimensions and position of the element.
 */
export function getRect<T extends Element>(
  element?: T | undefined | null
): RectResult {
  // Initialize the rect object with default values.
  let rect: RectResult = initialState
  // If the element is defined, calculate its DOMRect and update the rect object.
  if (element) {
    const domRect: DOMRect = element.getBoundingClientRect()
    rect = domRect
  }
  // Return the rect object.
  return rect
}

/**
 * A React hook to track the dimensions and position of a ref'd HTML element.
 * @param ref - A React ref object targeting an HTML element.
 * @param refresher - A dependency to trigger the resize listener when changed.
 * @returns A RectResult object representing the current dimensions and position of the ref'd element.
 */
export function useRect<T extends Element>(
  ref: React.RefObject<T> | undefined,
  refresher?: any
): RectResult {
  // Initialize the dimensions state with default values.
  const [dimensions, setDimensions] = useState(initialState)

  // Define a function to handle resize events.
  const handleResize = useCallback(() => {
    // If the ref'd element is not present, do nothing.
    if (!ref?.current) return
    // Otherwise, update the dimensions state with the rect of the ref'd element.
    setDimensions(getRect(ref?.current))
  }, [ref?.current])

  // Set up an event listener for resize events.
  useEffect(() => {
    // On mount or when dependencies change, run the handleResize function and set up the event listener.
    handleResize()
    window.addEventListener('resize', handleResize)
    // On unmount or when dependencies change, remove the event listener.
    return () => window.removeEventListener('resize', handleResize)
  }, [ref?.current, refresher])

  // Return the current dimensions of the ref'd element.
  return dimensions
}

/**
 * A React hook to track the dimensions and position of an HTML element.
 * @param elem - The HTML element to track.
 * @param refresher - A dependency to trigger the resize listener when changed.
 * @returns A RectResult object representing the current dimensions and position of the element.
 */
export function useElemRect(
  elem: Element | undefined,
  refresher?: any
): RectResult {
  const [dimensions, setDimensions] = useState(initialState)

  const handleResize = useCallback(() => {
    // If the element is not present, do nothing.
    if (!elem) return
    // Otherwise, update the dimensions state with the rect of the element.
    setDimensions(getRect(elem))
  }, [elem])

  useEffect(() => {
    // On mount or when dependencies change, run the handleResize function and set up the event listener.
    handleResize()
    window.addEventListener('resize', handleResize)
    // On unmount or when dependencies change, remove the event listener.
    return () => window.removeEventListener('resize', handleResize)
  }, [elem, refresher])

  return dimensions
}

// initial state of the dimensions, setting all values to 0.
const initialState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
}

// RectResult type, representing the dimensions and position of an HTML element.
export type RectResult = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}
