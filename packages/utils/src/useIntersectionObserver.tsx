import { RefObject, useEffect, useState } from 'react'

// Custom hook to use Intersection Observer API
export function useIntersectionObserver(
  elementRef: RefObject<Element>, // Reference to the DOM element to observe
  {
    threshold = 0, // The percentage (0-1) of the target's visibility to trigger the observer
    root = null, // The element that is used as the viewport for checking visibility. Null means the browser viewport.
    rootMargin = '0%', // Margin around the root, can be in pixels or percentages
    freezeOnceVisible = false, // Option to stop observing once the element is fully visible
  }: any
): any | undefined {
  const [entry, setEntry] = useState<any>() // State to store the intersection observer entry

  const frozen = entry?.isIntersecting && freezeOnceVisible // Boolean to determine if the observation should be stopped

  // Callback function to update the entry state when intersection changes
  const updateEntry = ([entry]: any[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current // Get the current DOM element from the ref
    const hasIOSupport = !!window.IntersectionObserver // Check if Intersection Observer is supported
    if (!hasIOSupport || frozen || !node) return // Early return if IO is not supported, observation is frozen, or node is not available

    // Create observer with the given options
    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node) // Start observing the specified element

    // Cleanup function to disconnect the observer when the component unmounts or dependencies change
    return () => observer.disconnect()

    // Dependencies array for useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen])

  return entry // Return the latest entry (state of element's visibility)
}
