---
title: 백오피스 프로젝트를 돌아보며
date: '2021-9-26'
tags: ['typescript', 'react', 'redux-toolkit', 'react-query']
draft: false
summary: 백오피스 개발하며 느낀 점
---

## 사용한 기술 스택

react, typescript, redux-toolkit, react-query, @emotion/styled, @emotion/css

## 개발하면서 좋았던 점

### TypeScript 언어적 측면

회사의 React 프로젝트는 모두 TypeScript로 작성되어 있었다. 그러나 나도 팀원들도 TypeScript에 대해서 잘 몰랐다. 그래서 TypeScript를 정착하고 싶은 마음이 있었다. 그 이유는 다음과 같다.

1. 개발자 친화적 언어
2. 타입이 잘못 되면 실행 불가능
3. 추상화 가능

프로젝트를 진행하는 동안 퇴근 후와 주말에는 [타입스크립트 프로그래밍](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=240515993) 책을 사서 공부했다. 개념을 잘 정리를 할 수 있었고, 팀원들에게 타입스크립트에 대해 공유할 시간이 있어서 공유할 수 있었다.

### 클라이언트 상태 관리 측면

회사에 React 프로젝트는 상태 관리를 따로 하지 않는 상황이었다. 그래서 이번 프로젝트를 진행하면서 Redux든 Mobx든 Recoil이든 도입하고 싶었다.
기술을 선택했을 때, 나의 기준은 2가지 였다.

1. TypeScript와의 호환성
2. 진입 장벽이 낮아야함

2번의 이유는 React를 어렵게 만드는 것이 Redux라고 생각했다. 그 이유는 코드가 길어지고, immutable하게 관리를 하기 위해서 귀찮은 작업이 있다.
Redux-Toolkit을 사용하면 어느 정도 해결된다. 코드가 길어지는 이유 증에 하나가 액션 생성자 때문인데, Redux-Toolkit은 따로 설정하기 않아도 되었다. Redux-Toolkit이 알아서 매핑해준다. 또한 immutable 문제도 <code>createSlice</code>를 이용하면 해결이 된다. 기본적으로 immer.js가 내장되어 있기 때문이다. 프로젝트가 마무리 될 시점에 zustand라는 라이브러리도 알게 되었다. 훅처럼 사용할 수 있다고 해서 나중에 사용해보면 좋을 것 같다.

### 비동기 상태 관리 측면

클라이언트 사이드 상태 관리와 마찬가지 상태였다. 다른 프로젝트들은 `useEffect` 안에서 모든 비동기 처리를 하고 있었다. 이것이 가독성을 떨어뜨리는 요인이라고 생각을 했다. 역시 기술 선택의 기준은 위와 같았다. 조사를 하던 중 React-Query가 훅처럼 사용할 수 있어서 괜찮아보였다. 확실히 가독성을 높일 수 있었다. 아쉬웠던 부분은 아래에서 말하겠다.

### Style 측면

스타일을 재활용하면서 개발을 진행했던 점이 좋았다. @emotion/styled와 TypeScript의 조합이 괜찮아서 스타일을 재활용하기 좋았다.

<br />

## 아쉬웠던 점

### 데이터는 어디에서 관리를 하는 게 좋은 걸까?

나는 모든 데이터를 Page Component에서 관리를 했다. 어떤 부작용이 있었냐하면 Page Component에 가지고 있는 데이터가 많아지고 있는 것이었다. 데이터 많아지니까 가독성이 떨어질 수밖에 없던 것 같다. 그래서 Github에 여러 프로젝트들을 보면서 다른 사람들은 데이터 관리를 어떻게 하고 있는지, 분석해봐야겠다.

### React-Query에 대해서

React-Query를 사용하면서 쉽게 개발을 하고 있었지만, 결국에는 어쩔 수 없이 `useEffect`를 사용하게 되었다. 특정 값이 변했을 때 `refetch`를 해야했다. 개인적으로 `useEffect`가 불편한 이유는 내부 로직을 봐야 이해할 수 있다는 것이다. 나는 "What"을 보여주고 싶은데 계속 "How"를 보여주고 있는 것이다. "How"를 보여주게 되면 코드 파악하는 시간이 길어진다.

### React-Query를 이용한 Optimistic UI 미적용

React-Query를 사용하면 `onMutate`에서 [Optimistic UI](https://react-query.tanstack.com/guides/optimistic-updates)를 적용할 수 있다. 하지만 아직 익숙하지 않은 상태라서 mutate가 성공하면(이것은 `onSuccess`에서 하면 된다.) 전체를 다시 fetch 하는 방식으로 했다. 이 방법이 틀린 것은 아니다. 그러나 전체 fetch를 하면서 리소스가 낭비되었다. Optimistic UI를 적용하는 방법에 대해서 연구를 해야겠다.

### 비동기 처리

다른 얘기이지만 비동기 처리하는 게 프론트에 난제(?)인 것 같다. 비동기 처리를 하는 솔루션은 다양하게 있다. Redux Middleware 진영만 하더라도, Redux-Thunk, Redux-Saga, Redux-Observable 등등 많다. 다른 라이브러리로는 SWR이 있을 것이다. "왜 이렇게 많은 솔루션이 있는 것일까?" 생각해보면 모두가 어려워하는 문제이기 때문이다. 해결하는 방식이 서로 다 다르다.

- Redux-Thunk: async-await
- Redux-Saga: Generator
- Redux-Observable: RxJS

각각이 어떤 문제를 해결하고자 나온 것인지 공부해보는 것도 좋을 것 같다.

### 커스텀 훅과 테스트 코드 사용하지 않음

반복되는 로직이 없더라도, 선언적으로 추상화하면 좋을 것 같다는 생각을 했다. 특히 `useEffect`를 사용하는 부분은 더더욱 말이다. 커스텀 훅을 사용한다면 테스트 코드는 **필수**라고 생각한다. 사실 Redux를 사용하는 순간부터 테스트 코드는 필수였다. 하지만 테스트 코드를 작성하는 역량이 부족한 내탓이다. 테스트 코드에 대해서 공부를 해야겠다.
