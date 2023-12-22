import React, { useRef, useEffect, useState } from 'react'
import useMutationObserver from '@rooks/use-mutation-observer'
import ResizeObserver from 'resize-observer-polyfill'

// `Observables` is a React Functional Component that observes DOM mutations and resizes.
const Observables: React.FC<ObservablesProps> = ({
  mutationObservables,
  resizeObservables,
  refresh,
}) => {
  // State to keep track of the number of mutations.
  const [mutationsCounter, setMutationsCounter] = useState(0)
  // Ref to attach the mutation observer to.
  const ref = useRef(document.documentElement || document.body)

  // Function to refresh highlighted region if an observable node is mutated.
  function refreshHighlightedRegionIfObservable(nodes: NodeList) {
    const posibleNodes = Array.from(nodes)
    for (const node of posibleNodes) {
      if (mutationObservables) {
        if (!(node as Element).attributes) {
          continue
        }
        // Check if the mutated node matches any of the specified observables.
        const found = mutationObservables.find((observable: string) =>
          (node as Element).matches(observable)
        )

        // If a match is found, trigger a refresh.
        if (found) {
          refresh(true)
        }
      }
    }
  }

  // Function to increment the mutations counter if an observable node is resized.
  function incrementMutationsCounterIfObservable(nodes: NodeList) {
    const possibleNodes = Array.from(nodes)

    for (const node of possibleNodes) {
      if (resizeObservables) {
        if (!(node as Element).attributes) {
          continue
        }
        // Check if the resized node matches any of the specified observables.
        const found = resizeObservables.find((observable: string) =>
          (node as Element).matches(observable)
        )

        // If a match is found, increment the mutations counter.
        if (found) setMutationsCounter(mutationsCounter + 1)
      }
    }
  }

  // Hook to observe mutations using a Mutation Observer.
  useMutationObserver(
    ref,
    (mutationList: MutationRecord[]) => {
      for (const mutation of mutationList) {
        // If nodes were added, check if they should trigger a refresh or increment the counter.
        if (mutation.addedNodes.length !== 0) {
          refreshHighlightedRegionIfObservable(mutation.addedNodes)
          incrementMutationsCounterIfObservable(mutation.addedNodes)
        }

        // If nodes were removed, check if they should trigger a refresh or increment the counter.
        if (mutation.removedNodes.length !== 0) {
          refreshHighlightedRegionIfObservable(mutation.removedNodes)
          incrementMutationsCounterIfObservable(mutation.removedNodes)
        }
      }
    },
    // Configuration options for the Mutation Observer.
    { childList: true, subtree: true }
  )

  // Hook to observe resize events using a Resize Observer.
  useEffect(() => {
    if (!resizeObservables) {
      return
    }

    // Create a new Resize Observer to handle resize events.
    const resizeObserver: ResizeObserver = new ResizeObserver(() => {
      refresh()
    })

    // Attach the Resize Observer to all specified observables.
    for (const observable of resizeObservables) {
      const element = document.querySelector(observable)
      if (element) {
        resizeObserver.observe(element)
      }
    }

    // Cleanup: Disconnect the Resize Observer on component unmount.
    return () => {
      resizeObserver.disconnect()
    }
  }, [resizeObservables, mutationsCounter])

  // The component does not render anything to the DOM.
  return null
}

// Prop types for the `Observables` component.
type ObservablesProps = {
  mutationObservables?: string[]
  resizeObservables?: string[]
  refresh?: any
}

export default Observables
