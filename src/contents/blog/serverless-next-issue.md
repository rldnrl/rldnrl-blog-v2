---
title: Serverless Next Component 배포 이슈와 해결 과정
date: '2023-11-04'
tags: ['Deploy']
draft: false
summary: Next 13을 Serverless Next Component로 배포 실패하는 이유를 분석해봤습니다.
---

Next.js 13을 Serverless Next.js Component로 배포하려는 시도가 실패로 끝난 원인을 분석해보았습니다.

## 문제 상황
배포 과정 중 아래와 같은 빌드 에러가 발생했습니다.
```
> Build error occurred
Error: The "target" property is no longer supported in next.config.js.
See more info here https://nextjs.org/docs/messages/deprecated-target-config
...
```

이 에러는 `next.config.js` 파일 내에서 더 이상 지원되지 않는 `target` 속성 때문에 발생하는 것으로 나타났습니다.


## 배포 문제를 일으킨 변경 사항 탐색
Git으로 코드를 관리하고 있었기 때문에, 이전에 정상적으로 빌드가 되었던 커밋으로 롤백해 문제의 원인을 추적했습니다. 그 과정에서 발견한 주요 차이점은 다음과 같습니다.

- 정상 빌드 시의 종속성 버전:
  ```
  "next": "12.0.7",
  "react": "17.0.2",
  "react-dom": "17.0.2",
  ```

- 문제가 발생한 빌드 시의 종속성 버전:
  ```
  "next": "13.0.6",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  ```

Next.js의 공식 문서를 확인한 결과, Next.js 13 버전에서는 `next.config.js` 파일 내의 `target` 설정이 사용 중단(deprecated)되었음을 확인할 수 있었습니다. (참고: [Next 13 Breaking Changes](https://nextjs.org/blog/next-13#breaking-changes))

Serverless Next.js Component의 코드를 살펴보니, `target`을 설정하는 부분이 존재했습니다. `useServerlessTraceTarget` 값이 `true`일 경우 `experimental-serverless-trace`를, 그렇지 않을 경우 `serverless`를 `target`으로 설정하는 로직이 포함되어 있었습니다. Next.js 13에서는 이 속성이 더 이상 유효하지 않기 때문에, 이 부분이 문제의 원인이었습니다. ([코드 원본](https://github.com/serverless-nextjs/serverless-next.js/blob/4316b18794f053d7ed929b9342a649d6e0ab6f68/packages/libs/core/src/build/lib/createServerlessConfig.ts))

## Serverless Next.js Component의 문제 코드:
```ts
// 코드에서 'target' 설정 부분
const target = useServerlessTraceTarget
  ? "experimental-serverless-trace"
  : "serverless";
```

## 해결 과정
결국, 배포가 되는 시점의 Next.js 버전으로 다운그레이드함으로써 문제를 해결했습니다. 이 경험을 계기로 팀은 배포 플랫폼을 AWS Amplify로 전환하기로 결정했습니다.
