---
title: Writing Easy-to-Compile Code 번역
date: '2021-10-01'
tags: ['typescript']
draft: false
summary: Writing Easy-to-Compile Code 부분을 번역했습니다.
---

[Writing Easy-to-Compile Code](https://github.com/microsoft/TypeScript/wiki/Performance) 부분을 번역했습니다.

더 빠른 컴파일 및 편집 경험을 보장하기 위해 TypeScript를 구성하는 쉬운 방법이 있습니다. 이러한 관행을 일찍 채택할수록 좋습니다. 모범 사례 외에도 느린 컴파일/편집 환경을 조사하기 위한 몇 가지 일반적인 기술, 몇 가지 일반적인 수정 사항 및 TypeScript 팀이 최후의 수단으로 문제를 조사하는 데 도움이 되는 몇 가지 일반적인 방법이 있습니다.

<br />

# 컴파일하기 쉬운 코드 작성

## Intersection(`&`) 보다 Interface 선호

대부분의 경우 객체 타입에 대한 단순 `type alias`은 `interface`와 매우 유사하게 작동합니다.

```ts
interface Foo {
  prop: string
}

type Bar = { prop: string }
```

그러나 두 개 이상의 타입을 구성해야 할 때, 인터페이스를 사용하여 타입을 확장하거나, 타입 별칭에서 교차 연산을 수행하면 이러한 차이점이 중요해집니다.

`interface`는 속성 충돌을 감지하는 단일 평면 객체 타입을 생성하며, 일반적으로 해결해야하는 중요한 충돌입니다! 반면 교차 연산은 속성을 재귀적으로 병합하고, 일부 경우에는 결코 생성되지 않을 수 있습니다. `interface`는 일관되게 더 나은 표시를 제공하며, intersection에서 타입 별칭은 다른 intersection의 일부로 표시할 수 없습니다. 인터페이스 간의 타입 관계도 캐시되는 반면, 교차점 타입 전체는 캐시되지 않습니다. 마지막으로, 대상 교차점 타입을 확인할 때, "effective"/"flattened" 타입에 대해 확인하기 전에 모든 구성 요소가 확인된다는 것도 주목할만합니다.

```ts
- type Foo = Bar & Baz & {
-     someProp: string;
- }
+ interface Foo extends Bar, Baz {
+     someProp: string;
+ }
```

## Type Annotation 사용

Type Annotation, 특히 반환 타입을 추가하면 컴파일러의 작업을 많이 절약할 수 있습니다. 부분적으로 이것은 명명된 타입이 익명 타입(컴파일러가 추론할 수 있음)보다 더 간결한 경향이 있기 때문에 선언 파일을 읽고 쓰는 데 소요되는 시간(예: 증분 빌드의 경우)을 줄입니다. 타입 유추는 매우 편리하므로 일반적으로 이 작업을 수행할 필요가 없습니다. 그러나 코드의 느린 부분을 식별한 경우 시도해 보면 유용할 수 있습니다.

```ts
- import { otherFunc } from "other";
+ import { otherFunc, otherType } from "other";

- export function func() {
+ export function func(): otherType {
      return otherFunc();
  }
```

## 유니온 타입보다 기본 타입 선호

Union 타입은 훌륭합니다. 이를 통해 타입에 대해 가능한 값의 범위를 표현할 수 있습니다.

```ts
interface WeekdaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  wake: Time
  startWork: Time
  endWork: Time
  sleep: Time
}

interface WeekendSchedule {
  day: 'Saturday' | 'Sunday'
  wake: Time
  familyMeal: Time
  sleep: Time
}

declare function printSchedule(schedule: WeekdaySchedule | WeekendSchedule)
```

그러나 유니온 타입은 또한 대가를 치르게 됩니다. 인자가 `printSchedule`에 전달될 때마다, 유니온의 각 요소와 비교되어야 합니다. 요소가 2개인 유니온의 경우 이는 간단하고 저렴합니다. **그러나 유니온에 12개 이상의 요소가 있는 경우 컴파일 속도에 실제 문제가 발생할 수 있습니다.** 예를 들어, 유니온에서 중복 멤버를 제거하려면 요소를 쌍으로 비교해야 하며, 이는 2차입니다. 이러한 종류의 검사는 큰 유니온를 교차할 때 발생할 수 있습니다. 여기서 각 유니온 멤버를 교차하면 축소해야 하는 엄청난 타입이 생성될 수 있습니다. 이것을 피하는 한 가지 방법은 유니온보다 하위 타입을 사용하는 것입니다.

```ts
interface Schedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  wake: Time
  sleep: Time
}

interface WeekdaySchedule extends Schedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  startWork: Time
  endWork: Time
}

interface WeekendSchedule extends Schedule {
  day: 'Saturday' | 'Sunday'
  familyMeal: Time
}

declare function printSchedule(schedule: Schedule)
```

모든 내장 DOM 요소 타입을 모델링하려고 할 때 이에 대한 보다 현실적인 예가 나타날 수 있습니다. 이 경우 완전한 유니온을 만드는 것보다(예를 들어서 `DivElementImgElementDivElement | /*...*/ | ImgElement | /*...*/`) 확장 `HtmlElement` 되는 공통 멤버로 기본 타입을 만드는 것이 좋습니다.
