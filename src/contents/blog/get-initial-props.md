---
title: getInitialProps
date: '2021-10-11'
tags: ['next']
draft: false
summary: getInitialProps에 대해서 알아보자.
---

## getInitialProps

`getInitialProps` 페이지에서 SSR을 활성화 하고 초기 데이터 채우기를 수행할 수 있도록 한다. 이는 서버에서 이미 채워진 데이터로 페이지를 보내는 것을 의미한다. 이것은 SEO에 특히 유용하다.

> getInitialProps [Automatic Static Optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization)를 비활성화 한다.

`getInitialProps`는 정적 메서드로 모든 페이지에 추가할 수 있는 비동기 함수다. 다음 예를 살펴보자.

```js
function Page({ stars }) {
  return <div>Next stars: {stars}</div>
}

Page.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
```

클래스형 컴포넌트는 아래와 같다.

```js
import React from 'react'

class Page extends React.Component {
  static async getInitialProps(ctx) {
    const res = await fetch('https://api.github.com/repos/vercel/next.js')
    const json = await res.json()
    return { stars: json.stargazers_count }
  }

  render() {
    return <div>Next stars: {this.props.stars}</div>
  }
}

export default Page
```

`getInitialProps`는 일부 데이터를 비동기적으로 가져온 다음 `props`을 채우는 데 사용된다. `getInitialProps`에서 반환된 데이터는 `JSON.stringify`가 하는 것과 유사하게 서버 렌더링 시 직렬화된다. `getInitialProps`에서 반환된 객체가 `Date`, `Map` 또는 `Set`을 사용하지 않는 일반 객체인지 확인해라.

초기 페이지 로드의 경우 `getInitialProps`는 서버에서만 실행된다. `getInitialProps`는 `next/link` 컴포넌트를 통해 또는 `next/router`를 사용하여 다른 경로로 이동할 때 클라이언트에서 실행된다. 그러나 `getInitialProps`가 사용자 정의 `_app.js`에서 사용되고 탐색되는 페이지가 `getServerSideProps`를 구현하는 경우 `getInitialProps`가 서버에서 실행된다.

### Context Object

`getInitialProps`는 컨텍스트라는 단일 인자를 수신하며 다음 속성을 가진 객체다.

- `pathname`: 현재 경로. /pages에 있는 페이지의 경로
- `query`: URL의 쿼리 스트링 부분을 객체로 파싱
- `asPath`: 브라우저에 표시되는 실제 경로(쿼리 포함)의 문자열
- `req`: HTTP 요청 객체 (서버 전용)
- `res`: HTTP 응답 객체 (서버 전용)
- `err`: 렌더링 중 오류가 발생한 경우 오류 객체

### 주의 사항

- `getInitialProps`는 자식 컴포넌트에서 사용할 수 없으며 모든 페이지의 기본 내보내기에서만 사용할 수 있다.
- `getInitialProps` 내에서 서버 측 전용 모듈을 사용하는 경우 [올바르게 가져와라](https://arunoda.me/blog/ssr-and-server-only-modules). 그렇지 않으면 앱 속도가 느려진다.

### TypeScript

TypeScript를 사용하는 경우 함수형 컴포넌트에 `NextPage` 타입을 사용할 수 있다.

```ts
import { NextPage } from 'next'

interface Props {
  userAgent?: string
}

const Page: NextPage<Props> = ({ userAgent }) => <main>Your user agent: {userAgent}</main>

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  return { userAgent }
}

export default Page
```

그리고 `React.Component`의 경우 `NextPageContext`를 사용할 수 있다.

```ts
import React from 'react'
import { NextPageContext } from 'next'

interface Props {
  userAgent?: string
}

export default class Page extends React.Component<Props> {
  static async getInitialProps({ req }: NextPageContext) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  render() {
    const { userAgent } = this.props
    return <main>Your user agent: {userAgent}</main>
  }
}
```
