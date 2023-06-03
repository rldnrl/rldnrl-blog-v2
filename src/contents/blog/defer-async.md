---
title: defer와 async 차이
date: '2021-11-18'
tags: ['javascript', 'defer', 'async']
draft: false
summary: defer와 async의 차이에 대해서 알아보자.
---

## defer
브라우저는 `defer` 속성이 있는 스크립트(이하 `defer` 스크립트 또는 지연 스크립트)를 '백그라운드’에서 다운로드 한다. 따라서 `defer` 스크립트를 다운로드 하는 도중에도 HTML 파싱이 멈추지 않는다. 그리고 `defer` 스크립트 실행은 페이지 구성이 끝날 때까지 지연 된다.

- `defer` 스크립트는 페이지 생성을 절대 막지 않는다.
- `defer` 스크립트는 DOM이 준비된 후에 실행되긴 하지만 [`DOMContentLoaded`](https://developer.mozilla.org/ko/docs/Web/API/Window/DOMContentLoaded_event) 이벤트 발생 전에 실행된다.

`defer` 스크립트는 일반 스크립트와 마찬가지로 HTML에 추가된 순(상대순, 요소순)으로 실행된다. 따라서 길이가 긴 스크립트가 앞에, 길이가 짧은 스크립트가 뒤에 있어도 짧은 스크립트는 긴 스크립트가 실행될 때까지 기다린다.

```html
<script src="large.js" defer></script>
<script src="small.js" defer></script>
```

### 작은 스크립트는 먼저 다운되지만, 실행은 나중에 된다.
브라우저는 성능을 위해 페이지에 어떤 스크립트들이 있는지 쭉 살펴본 후에야 스크립트를 병렬적으로 다운로드한다. `small.js`가 `large.js`보다 작으므로 먼저 다운로드 된다.

하지만 명세서에서 스크립트를 문서에 추가한 순서대로 실행하라고 정의했기 때문에 파일의 순서대로 실행이 된다. 따라서 `large.js`가 실행된 이후에 `small.js`가 실행된다.

### `defer` 속성은 외부 스크립트에서만 유효하다.
`<script>`에 `src`가 없으면 `defer` 속성은 무시된다.

## async
`async` 속성이 붙은 스크립트(이하 `async` 스크립트 또는 비동기 스크립트)는 페이지와 완전히 독립적으로 동작한다.

- `async` 스크립트는 `defer` 스크립트와 마찬가지로 백그라운드에서 다운로드된다. 따라서 HTML 페이지는 `async` 스크립트 다운이 완료되길 기다리지 않고 페이지 내 콘텐츠를 처리, 출력한다.
- `DOMContentLoaded` 이벤트와 `async` 스크립트는 서로를 기다리지 않는다.
  - 페이지 구성이 끝난 후에 `async` 스크립트 다운로딩이 끝난 경우, `DOMContentLoaded`는 `async` 스크립트 실행 전에 발생할 수 있다,
  - `async` 스크립트가 짧아서 페이지 구성이 끝나기 전에 다운로드 되거나 스크립트가 캐싱처리 된 경우, `DOMContentLoaded`는 `async` 스크립트 실행 후에 발생할 수도 있다.
- 다른 스크립트들은 `async` 스크립트를 기다리지 않는다. `async` 스크립트 역시 다른 스크립트들을 기다리지 않는다.

이런 특징 때문에 페이지에 `async` 스크립트가 여러 개 있는 경우, 그 실행 순서가 제각각이 된다. 실행은 다운로드가 끝난 스크립트 순으로 진행된다.

- `async` 스크립트 다운로드는 페이지 로딩을 막지 않기 때문에 페이지 콘텐츠가 바로 출력된다.
- `DOMContentLoaded` 이벤트는 상황에 따라 비동기 스크립트 전이나 후에 실행된다. 정확한 순서를 예측할 수 없다.
- `async` 스크립트는 서로를 기다리지 않다. 위치상으론 `small.js`가 아래이긴 하지만 `large.js`보다 먼저 다운로드되었기 때문에 먼저 실행된다. 이렇게 먼저 로드가 된 스크립트가 먼저 실행되는 것을 'load-first order’라고 부른다.

`async` 스크립트는 방문자 수 카운터나 광고 관련 스크립트처럼 각각 독립적인 역할을 하는 서드 파티 스크립트를 현재 개발 중인 스크립트에 통합하려 할 때 아주 유용하다. `async` 스크립트는 개발 중인 스크립트에 의존하지 않고, 그 반대도 마찬가지이기 때문이다.

## 동적 스크립트
자바스크립트를 사용하면 문서에 스크립트를 동적으로 추가할 수 있다. 이렇게 추가한 스크립트를 **동적 스크립트(dynamic script)**라고 부른다.

```js
let script = document.createElement('script');
script.src = "/article/script-async-defer/long.js";
document.body.append(script); // (*)
```

위 예시에서 외부 스크립트는 관련 요소가 문서에 추가되자 마자((*)로 표시한 줄) 다운로드가 시작된다. 그런데 동적 스크립트는 기본적으로 ‘async’ 스크립트처럼 행동한다. 따라서 다음과 같은 특징을 갖는다.

- 동적 스크립트는 그 어떤 것도 기다리지 않는다. 그리고 그 어떤 것도 동적 스크립트를 기다리지 않는다.
- 먼저 다운로드된 스크립트가 먼저 실행된다(‘load-first’ order).

아래 예시에선 두 스크립트를 동적으로 문서에 추가한다. 그런데 `script.async=false`가 없었다면 이 스크립트들은 'load-first order’로 실행된다. 그럼 크기가 작은 `small.js`가 먼저 실행되겠지만 `script.async=false`가 있기 때문에 실행은 '문서에 추가된 순서’대로 된다.

```js
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.append(script);
}

// async=false이기 때문에 long.js가 먼저 실행
loadScript("/article/script-async-defer/long.js");
loadScript("/article/script-async-defer/small.js");
```

참고
[JavaScript.Info - defer와 async 스크립트](https://ko.javascript.info/script-async-defer)