// Define a function type `StyleFn` for generating CSS properties.
// It takes in two objects (props and state) and returns a React CSS properties object.
export type StyleFn = (
  props: { [key: string]: any },
  state?: { [key: string]: any }
) => React.CSSProperties & { rx?: number }

// Define the different style functions available for different parts of the Mask component.
export type Styles = {
  maskWrapper: StyleFn
  svgWrapper: StyleFn
  maskArea: StyleFn
  maskRect: StyleFn
  clickArea: StyleFn
  highlightedArea: StyleFn
}

// A type for a potentially partial styles object.
export type StylesObj = {
  [key in StyleKey]?: StyleFn
}

// A type for valid keys of the Styles type.
export type StyleKey = keyof Styles

// This type is deprecated in favor of `StyleKey` for clearer naming.
/**
 * @deprecated Use `StyleKey` alias instead.
 */
export type StylesKeys = StyleKey

export const defaultStyles: Styles = {
  maskWrapper: () => ({
    opacity: 0.7,
    left: 0,
    top: 0,
    position: 'fixed',
    zIndex: 99999,
    pointerEvents: 'none',
    color: '#000',
  }),
  svgWrapper: ({ windowWidth, windowHeight, wpt, wpl }) => ({
    width: windowWidth,
    height: windowHeight,
    left: Number(wpl),
    top: Number(wpt),
    position: 'fixed',
  }),
  maskArea: ({ x, y, width, height }) => ({
    x,
    y,
    width,
    height,
    fill: 'black',
    rx: 0,
  }),
  maskRect: ({ windowWidth, windowHeight, maskID }) => ({
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight,
    fill: 'currentColor',
    mask: `url(#${maskID})`,
  }),
  clickArea: ({ windowWidth, windowHeight, clipID }) => ({
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight,
    fill: 'currentcolor',
    pointerEvents: 'auto',
    clipPath: `url(#${clipID})`,
  }),
  highlightedArea: ({ x, y, width, height }) => ({
    x,
    y,
    width,
    height,
    pointerEvents: 'auto',
    fill: 'transparent',
    display: 'none',
  }),
}

// Type for a function that gets styles for a given key and extra data.
export type getStylesType = (
  key: StyleKey,
  extra?: { [key: string]: any }
) => {}

// A utility function to determine the appropriate styles based on the given key and state.
// If a custom style function exists for the key, it's used. Otherwise, default styles are returned.
export function stylesMatcher(styles: StylesObj) {
  return (key: StyleKey, state: {}): React.CSSProperties & { rx?: number } => {
    const base = defaultStyles[key](state)
    const custom = styles[key]
    return custom ? custom(base, state) : base
  }
}
