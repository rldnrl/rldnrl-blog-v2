---
title: any와 unknown의 차이
date: '2022-01-11'
tags: ['typescript']
draft: false
summary: any와 unknown의 차이에 대해서 알아봅시다.
---

오늘은 `any`와 `unknown`의 차이에 대해서 알아봅시다.

`any` 타입을 먼저 알아볼까요? `any` 타입은 말 그대로 모든 타입을 다 수용할 수 있습니다. 또 다른 특징은 타입 체커가 인식을 하지 않죠.

```ts
let variableAny: any

variableAny = true // any
variableAny = 1 // any
variableAny = 'string' // any
variableAny = {} // any
```

어떤 타입의 값을 대입해도 `any` 타입이 나옵니다.

다음은 `unknown`을 살펴보겠습니다.

```ts
let variableUnknown: unknown

variableUnknown = true // unknown
variableUnknown = 1 // unknown
variableUnknown = 'string' // unknown
variableUnknown = {} // unknown
```

`unknown`으로 선언된 타입들도 어떤 타입의 값을 대입해도 `unknown` 타입 입니다.

`unknown` 타입으로 선언된 변수는 `any`를 제외한 다른 타입으로 선언된 변수에 할당할 수 없습니다. 이것은 `unknown` 타입은 모든 타입의 상위 타입이기 때문입니다. 하위 타입에 상위 타입을 대입할 수 없는 것은 당연한 사실입니다. 예를 들면, "새는 동물이다."는 맞는 말이지만, "동물은 새이다."는 말이 안 됩니다.

```ts
let unknownType: unknown

let anyType: any = unknownType
let booleanType: boolean = unknownType
// Error: Type 'unknown' is not assignable to type 'boolean'.(2322)
let numberType: number = unknownType
//  Error: Type 'unknown' is not assignable to type 'number'.(2322)
let stringType: string = unknownType
//  Error: Type 'unknown' is not assignable to type 'string'.(2322)
let objectType: object = unknownType
//  Error: Type 'unknown' is not assignable to type 'object'.(2322)
```

그렇다면 `unknown`은 객체 프로퍼티에는 접근할 수 있을까요? 당연히 할 수 없습니다. `unknown`은 "아직 알려지지 않은 타입"이기 때문에 객체에 어떤 것에도 접근할 수 없습니다.

실용적인 예제를 볼까요? React 컴포넌트에서 `UserProps`의 `user`를 구조 분해 할당을 하려고 합니다. `user`는 아직 타입을 알 수 없어서 `unknown` 타입으로 지정했습니다.

```ts
type UserProps = {
  user: unknown
}

const User = ({ user }: UserProps) => {
  const { username, age } = user // Property 'username' does not exist on type 'unknown'.(2339)
}
```

그렇다면 위와 같이 알 수는 없지만 `any`를 쓰지 않고 객체에 접근할 수 있는 방법은 없을까요?

바로 매핑된 타입을 이용하면 가능합니다.

```ts
type UserProps = {
  user: {
    [key in string]: unknown
  }
}

const User = ({ user }: UserProps) => {
  const { username, age } = user
}
```

하지만 객체 안에 또 다른 객체가 있을 경우는 다른 `any`를 사용하는 것도 하나의 방법입니다. 이펙티브 타입스크립트에서는 "부정확한 타입을 사용하기보다 미완성의 타입을 사용하세요"라고 말합니다.

다음에는 `any` 타입을 언제 사용하면 안 되고, 언제 사용하면 좋은지 정리해보겠습니다.
