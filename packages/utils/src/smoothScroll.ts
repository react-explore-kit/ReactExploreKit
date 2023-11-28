/**
 * Smoothly scrolls to a given element and returns a promise that resolves when the scrolling is complete.
 *
 * @param {Element | null} elem - The target element to scroll to.
 * @param {ScrollIntoViewOptions} options - Options to define how the scrolling should behave.
 * @returns {Promise<void>} - A promise that resolves when the scrolling is complete.
 * @throws {TypeError} - Throws an error if the provided element is not an instance of Element.
 *
 * @see {@link https://stackoverflow.com/questions/46795955/how-to-know-scroll-to-element-is-done-in-javascript}
 */

export function smoothScroll(
  elem: Element | null,
  options: ScrollIntoViewOptions
): Promise<void> {
  return new Promise((resolve) => {
    // Check if the provided element is an instance of Element.
    if (!(elem instanceof Element)) {
      throw new TypeError('Argument 1 must be an Element')
    }

    // Variable to keep track of how many times the position remained unchanged.
    let same = 0
    // Variable to store the last known position of the element.
    let lastPos: undefined | null | number = null
    // Merge the default scroll behavior with any provided options.
    const scrollOptions = Object.assign({ behavior: 'smooth' }, options)

    // Initiate the smooth scroll to the element.
    elem.scrollIntoView(scrollOptions)

    // Use the requestAnimationFrame method to check the scroll position in the next frame.
    requestAnimationFrame(check)

    /**
     * Checks if the element's position has changed after each animation frame.
     * If the position remains the same for more than 2 frames, it's assumed the scrolling is complete.
     */
    function check() {
      // Get the current vertical position of the element.
      const newPos = elem?.getBoundingClientRect().top

      // If the position hasn't changed from the last known position...
      if (newPos === lastPos) {
        // ...increment the 'same' counter.
        if (same++ > 2) {
          // If position remained unchanged for more than 2 frames, resolve the promise.
          return resolve()
        }
      } else {
        // Reset the counter and update the last known position if the position changed.
        same = 0
        lastPos = newPos
      }

      // Request to check the position again in the next animation frame.
      requestAnimationFrame(check)
    }
  })
}
