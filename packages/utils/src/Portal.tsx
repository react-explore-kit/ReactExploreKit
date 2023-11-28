import React, { useLayoutEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * A React component that creates a portal, which renders children into a DOM node
 * that exists outside the DOM hierarchy of the parent component.
 */

const Portal: React.FC<PortalProps> = ({
  children,
  type = 'react-explore-kit',
}) => {
  // A reference to the initial span element to figure out the ownerDocument later.
  let mountNode = useRef<HTMLDivElement | null>(null)
  // A reference to the portal's root DOM node.
  let portalNode = useRef<Element | null>(null)
  // Force component re-render. It doesn't use the state value but uses the setter function.
  let [, forceUpdate] = useState({})

  useLayoutEffect(() => {
    if (!mountNode.current) return

    // Determine which document the mountNode is a part of (could be the main window's document or an iframe's).
    const ownerDocument = mountNode.current!.ownerDocument
    // Create a new DOM element in the owner document to serve as the portal root.
    portalNode.current = ownerDocument?.createElement(type)!
    // Append this portal root to the body of the owner document.
    ownerDocument!.body.appendChild(portalNode.current)
    // Cause the component to re-render so it will render the children inside the portal node.
    forceUpdate({})

    // Cleanup: when the component is unmounted or if the type changes,
    // remove the portal root from the body.
    return () => {
      if (portalNode.current && portalNode.current.ownerDocument) {
        portalNode.current.ownerDocument.body.removeChild(portalNode.current)
      }
    }
  }, [type]) // The effect depends on the `type` prop.

  // If the portal node has been attached, render the children into it using React's createPortal,
  // otherwise render a span element that will be used to determine the ownerDocument.
  return portalNode.current ? (
    createPortal(children, portalNode.current)
  ) : (
    <span ref={mountNode} />
  )
}

/**
 * Type definition for the props accepted by the Portal component.
 */
export type PortalProps = {
  // The React children that will be rendered inside the portal.
  children?: any
  // The tag name for the DOM node where children will be portaled to.
  // Defaults to 'reactour-portal'.
  type?: string
}

export default Portal
