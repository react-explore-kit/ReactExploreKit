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
