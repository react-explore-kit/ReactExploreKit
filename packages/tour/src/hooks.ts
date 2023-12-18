import { useCallback, useEffect, useState } from 'react'
import { StepType } from './types'
import {
  inView,
  smoothScroll,
  getWindow,
  getRect,
} from '@react-explore-kit/utils'

let initialState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  windowWidth: 0,
  windowHeight: 0,
  x: 0,
  y: 0,
}

/**
 * Custom React hook that computes and responds to the size and position of
 * an element specified by the step, and also manages smooth scrolling into view.
 *
 * @param {StepType} step - Represents information about the current step.
 * @param {ScrollIntoViewOptions & { inViewThreshold?: number | { x?: number; y?: number } }} scrollOptions
 *        - Options for scrolling into view with an added inViewThreshold property.
 * @returns {object} - Contains the current dimensions of the element, transition state,
 *                     target element, function to refresh the observable, and highlighting observation state.
 */

export function useSizes(
  step: StepType,
  scrollOptions: ScrollIntoViewOptions & {
    inViewThreshold?: number | { x?: number; y?: number }
  } = {
    block: 'center',
    behavior: 'smooth',
    inViewThreshold: 0,
  }
) {
  // State for managing transitions (like smooth scroll)
  const [transition, setTransition] = useState(false)
  // State indicating if the target is currently being observed for changes
  const [observing, setObserving] = useState(false)
  // State indicating if the highlighting is observed
  const [isHighlightingObserved, setIsHighlightingObserved] = useState(false)
  // State to trigger a refresh of dimensions calculation
  const [refresher, setRefresher] = useState(null as any)
  // State to store the dimensions of the target element
  const [dimensions, setDimensions] = useState(initialState)

  // Getting the target DOM element from the step's selector
  const target =
    step?.selector instanceof Element
      ? step?.selector
      : document.querySelector(step?.selector)

  /**
   * Callback function to handle resize event. It calculates the new dimensions
   * of the target and updates the state if the dimensions have changed.
   */
  const handleResize = useCallback(() => {
    const newDimensions: any = getHighlightedRect(
      target,
      step?.highlightedSelectors,
      step?.bypassElem
    )
    if (
      Object.entries(dimensions).some(
        ([key, value]) => newDimensions[key] !== value
      )
    ) {
      setDimensions(newDimensions)
    }
  }, [target, step?.highlightedSelectors, dimensions])

  // Effect hook to listen for resize events and recompute dimensions
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [target, step?.highlightedSelectors, refresher])

  // Effect hook to check if the target element is in view and smoothly scroll to it if not
  useEffect(() => {
    const isInView = inView({
      ...dimensions,
      threshold: scrollOptions.inViewThreshold,
    })
    if (!isInView && target) {
      setTransition(true)
      smoothScroll(target, scrollOptions)
        .then(() => {
          if (!observing) setRefresher(Date.now())
        })
        .finally(() => {
          setTransition(false)
        })
    }
  }, [dimensions])

  /**
   * Function to refresh the observable. This will recompute the dimensions of the target
   * and check if any highlighted elements are being observed.
   */
  function observableRefresher() {
    setObserving(true)
    const { hasHighligtedElems, ...dimesions } = getHighlightedRect(
      target,
      step?.highlightedSelectors,
      step?.bypassElem
    )
    setIsHighlightingObserved(hasHighligtedElems)
    setDimensions(dimesions)
    setObserving(false)
  }

  // Return values from the hook
  return {
    sizes: dimensions,
    transition,
    target,
    observableRefresher,
    isHighlightingObserved,
  }
}

/**
 * Calculates the rectangle encompassing a given DOM node and additional highlighted elements.
 * The function takes into account visibility and optional bypassing of the main node's rectangle.
 *
 * @param {Element | null} node - The main DOM element for which to calculate the rectangle.
 * @param {string[]} highlightedSelectors - An array of CSS selectors for additional elements to include in the calculation.
 * @param {boolean} bypassElem - A flag indicating whether to bypass the main node's rectangle in the calculation.
 * @returns {object} - An object describing the calculated rectangle and additional information.
 */

function getHighlightedRect(
  node: Element | null,
  highlightedSelectors: string[] = [],
  bypassElem = true
) {
  // Flag indicating whether any highlighted elements are found and visible
  let hasHighligtedElems = false

  // Getting the window dimensions
  const { w: windowWidth, h: windowHeight } = getWindow()

  // If no highlighted selectors are provided, return the rectangle of the main node (or an empty rectangle if node is null)
  if (!highlightedSelectors) {
    return {
      ...getRect(node),
      windowWidth,
      windowHeight,
      hasHighligtedElems: false,
    }
  }

  // Get the rectangle of the main node
  let attrs = getRect(node)

  // Initialize an alternative rectangle to represent the combined area of all highlighted elements
  let altAttrs = {
    bottom: 0,
    height: 0,
    left: windowWidth,
    right: 0,
    top: windowHeight,
    width: 0,
  }

  // Iterate over the highlighted selectors to adjust the alternative rectangle based on visible elements
  for (const selector of highlightedSelectors) {
    const element = document.querySelector(selector) as HTMLElement
    // Skip hidden elements
    if (
      !element ||
      element.style.display === 'none' ||
      element.style.visibility === 'hidden'
    ) {
      continue
    }

    // Get the rectangle of the current highlighted element
    const rect = getRect(element)

    // Update the flag since a visible highlighted element is found
    hasHighligtedElems = true

    // Calculate the combined rectangle based on the current element's rectangle
    if (bypassElem || !node) {
      // If bypassing the main node's rectangle, or if the main node is null, adjust the alternative rectangle
      altAttrs = calculateCombinedRect(altAttrs, rect)
    } else {
      // Otherwise, adjust the main node's rectangle
      attrs = calculateCombinedRect(attrs, rect)
    }
  }

  // Determine if the alternative rectangle should be used (bypassing the main node's rectangle)
  const bypassable =
    bypassElem || !node ? altAttrs.width > 0 && altAttrs.height > 0 : false

  // Return the calculated rectangle and additional information
  return {
    ...(!bypassable ? attrs : altAttrs),
    windowWidth,
    windowHeight,
    hasHighligtedElems,
    x: attrs.x,
    y: attrs.y,
  }
}

/**
 * Helper function to calculate the combined rectangle of two rectangles.
 *
 * @param {object} rect1 - The first rectangle.
 * @param {object} rect2 - The second rectangle.
 * @returns {object} - The combined rectangle.
 */
function calculateCombinedRect(rect1: any, rect2: any) {
  const combinedRect = { ...rect1 }

  if (rect2.top < combinedRect.top) {
    combinedRect.top = rect2.top
  }

  if (rect2.right > combinedRect.right) {
    combinedRect.right = rect2.right
  }

  if (rect2.bottom > combinedRect.bottom) {
    combinedRect.bottom = rect2.bottom
  }

  if (rect2.left < combinedRect.left) {
    combinedRect.left = rect2.left
  }

  combinedRect.width = combinedRect.right - combinedRect.left
  combinedRect.height = combinedRect.bottom - combinedRect.top

  return combinedRect
}
