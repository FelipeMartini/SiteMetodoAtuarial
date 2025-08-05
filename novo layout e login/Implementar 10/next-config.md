# Next.js Configuration for Styled Components

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      preprocess: false,
    },
  },
  transpilePackages: ['styled-components'],
}

module.exports = nextConfig
```

## Alternative Configuration with .babelrc

If you encounter issues with the compiler configuration, you can use a Babel configuration instead:

### .babelrc
```json
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "styled-components",
      {
        "ssr": true,
        "displayName": true,
        "preprocess": false
      }
    ]
  ]
}
```

## Registry for SSR Support (lib/registry.tsx)

```typescript
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

## Package.json Dependencies

Add these dependencies to your project:

```json
{
  "dependencies": {
    "styled-components": "^6.1.8"
  },
  "devDependencies": {
    "@types/styled-components": "^5.1.34",
    "babel-plugin-styled-components": "^2.1.4"
  }
}
```

## Installation Commands

```bash
npm install styled-components
npm install -D @types/styled-components babel-plugin-styled-components

# or with yarn
yarn add styled-components
yarn add -D @types/styled-components babel-plugin-styled-components
```