export type PositionsType = 'left' | 'right' | 'top' | 'bottom'

/**
 * `PositionsObjectType` is a TypeScript type that defines an object type.
 * This object has string keys (representing positions) and number values.
 * For example, an object of this type could look like: { left: 10, top: 20 }.
 */
export type PositionsObjectType = {
  [position: string]: number
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

/**
 * Type definition for the arguments of inView function.
 */

export type InViewArgs = RectResult & {
  threshold?: { x?: number; y?: number } | number
}
