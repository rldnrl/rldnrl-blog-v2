---
title: Next.js에서 Testing 세팅하기
date: '2022-01-10'
tags: ["next.js", "testing"]
draft: false
summary: Next.js에서 Test 세팅을 진행해봅시다.
---

회사에서 Testing을 도입하려고 하고 있습니다. 그러기 위해서는 세팅을 먼저 해야겠죠?

먼저 필요한 라이브러리를 설치해봅시다.

```
yarn add jest @testing-library/react @testing-library/jest-dom @types/jest @testing-library/user-event -D
```

혹시 `@emotion` 라이브러리를 사용하고 있다면 다음 라이브러리도 설치해주세요.

```
yarn add @emotion/jest
```

본격적으로 `jest.config.js`를 세팅해보겠습니다.

## Next.js 12 이전 버전

```js:jest.config.js
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testEnvironment: 'jest-environment-jsdom',
  snapshotSerializers: [
    '@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */
  ]
}
```

## Next.js 12 버전 이상

```js:jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // Handle module aliases
  moduleNameMapper: {
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

next.js 12는 jest를 포함하고 있어서 설정이 짧습니다.

- SWC를 사용하여 `transform`을 설정합니다.
- `.css`, `.module.css`와 image를 기본적으로 모킹합니다.
- `.env`를 `process.env`에 로드합니다.
- `node_modules` 폴더를 무시합니다.
- `.next` 폴더를 무시합니다.
- SWC 변환을 활성화하는 플래그에 대해 `next.config.js` 로드합니다.

## jest.setup.js 세팅

```js:jest.setup.js
import "@testing-library/jest-dom"
```
만약 여러분이 테스트 전에 설정하고 싶은 것들이 있다면 `jest.setup.js`에 추가하면 됩니다.

여기까지 하셨다면 이제 테스팅을 위한 준비가 되었습니다. 이제 TDD를 할 준비가 되었네요. 다음에는 테스트 하면서 만나는 에러를 정리해보겠습니다.