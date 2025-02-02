<p align="center">
  <img alt="React Explore Kit" title="React Explore Kit" src="https://docs-orcin-xi.vercel.app/_next/image?url=%2Flogo.png&w=1200&q=75" width="250">
</p>
<p align="center" style="margin-top: 40px">
  A powerful React-based touring library that provides essential tools for creating interactive, guided tours, popovers, and utilities to enhance user experiences on web applications.
</p>

# React Explore Kit 🚀

[![Documentation](https://docs-react-explore-kit.vercel.app/)](https://docs-react-explore-kit.vercel.app/)
[![Demo](https://demo-react-explore-kit.vercel.app/)](https://demo-react-explore-kit.vercel.app/)
[![NPM](https://www.npmjs.com/package/@react-explore-kit/tour)](https://www.npmjs.com/package/@react-explore-kit/tour)

# React-Explore Kit

**A powerful React-based touring library that provides essential tools for creating interactive, guided tours, popovers, and utilities to enhance user experiences on web applications.**

---

## 🚀 Features

- **Touring Components**: Create guided tours for web applications with customizable steps.
- **Popover Management**: Simple popovers with easy-to-use APIs.
- **Masking & Highlighting**: Highlight key UI elements during onboarding.
- **Utility Functions**: Essential helper utilities for smooth UI interactions.
- **TypeScript Support**: Fully typed for better developer experience.
- **Highly Customizable**: Offers flexibility with styling and behavior modifications.

---

## 📦 Installation

To install the package via npm or yarn:

```sh
npm install @react-explore-kit/tour
# or
yarn add @react-explore-kit/tour
```

## 🚀 Quick Start

### 1️⃣ Basic Usage

```tsx
import { Tour } from '@react-explore-kit/tour';

const steps = [
  { selector: '#step1', content: 'This is the first step' },
  { selector: '#step2', content: 'This is the second step' }
];

export default function App() {
  return <Tour steps={steps} />;
}
```

### 2️⃣ Popover Component

```tsx
import { Popover } from '@react-explore-kit/popover';

<Popover content="Hello, World!">
  <button>Hover me</button>
</Popover>;
```

### 3️⃣ Mask Component

```tsx
import { Mask } from '@react-explore-kit/mask';

<Mask selector="#important-section" />;
```

---

## 📚 API Reference

### `<Tour />`
| Prop        | Type            | Description                        |
|------------|---------------|--------------------------------|
| `steps`    | `Array`        | List of steps in the tour       |
| `onFinish` | `Function`     | Callback when tour completes   |

### `<Popover />`
| Prop     | Type       | Description                     |
|----------|-----------|---------------------------------|
| `content` | `string`  | Text to display in popover |

### `<Mask />`
| Prop     | Type       | Description                     |
|----------|-----------|---------------------------------|
| `selector` | `string`  | CSS selector of element to mask |

---

## 🎨 Customization

This library provides flexibility in customization:

```tsx
<Tour
  steps={steps}
  theme={{
    arrowColor: 'red',
    backgroundColor: 'black',
    textColor: 'white'
  }}
/>
```

---

## 🛠 Development

### Clone the Repository

```sh
git clone https://github.com/react-explore-kit/ReactExploreKit.git
cd ReactExploreKit
```

### Install Dependencies

```sh
npm install
```

### Run the Development Server

```sh
npm start
```

---

## 🤝 Contributing

We welcome contributions! If you'd like to improve this library, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
