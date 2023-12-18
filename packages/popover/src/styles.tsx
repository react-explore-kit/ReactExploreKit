// Define a limited set of valid keys for our styles object.
export type StylesKeys = 'popover'

// The StylesObj type is an object that maps a StylesKey to an optional style function.
export type StylesObj = {
  [key in StylesKeys]?: StyleFn
}

// The StyleFn is a function type that receives props and state objects and returns CSS properties for React components.
export type StyleFn = (
  props: { [key: string]: any },
  state?: { [key: string]: any }
) => React.CSSProperties

// Define a stricter Styles type that explicitly requires a StyleFn for the 'popover' key.
export type Styles = {
  popover: StyleFn
}

// StyleKey is a type that represents the keys of the Styles type (currently just 'popover').
export type StyleKey = keyof Styles

// Define the default styles for the popover component.
export const defaultStyles: Styles = {
  popover: () => ({
    position: 'fixed',
    maxWidth: 353,
    // minWidth: 150, // this line is commented out and won't affect the style.
    backgroundColor: '#fff',
    padding: '24px 30px',
    boxShadow: '0 0.5em 3em rgba(0, 0, 0, 0.3)',
    color: 'inherit',
    zIndex: 100000,
    transition: 'transform 0.3s',
    top: 0,
    left: 0,
  }),
}

// Define the type for the `getStylesType` function. It accepts a StylesKeys and an optional extra parameter but does not return anything.
export type getStylesType = (key: StylesKeys, extra?: any) => {}

// The stylesMatcher function creates a matcher for styles.
// Given a styles object, it returns a function that:
// 1. Accepts a key and state object
// 2. Matches the key to the default style and the given custom styles
// 3. Merges the custom style with the default if provided
export function stylesMatcher(styles: StylesObj) {
  return (key: StyleKey, state: {}): {} => {
    const base = defaultStyles[key](state) // get default style for the given key
    const custom = styles[key] // get custom style for the given key
    return custom ? custom(base, state) : base // merge or return default
  }
}
