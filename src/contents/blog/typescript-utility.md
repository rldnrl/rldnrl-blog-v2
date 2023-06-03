---
title: TypeScript 내부 유틸리티 타입
date: '2021-9-27'
tags: ['typescript']
draft: false
summary: TypeScript 내부 유틸리티 타입을 한 번 보자.
---

## `Partial<T>`

```tsx
type Partial<T> = { [P in keyof T]?: T[P]; }
```

`T`의 모든 프로퍼티를 선택적으로 만드는 타입을 구성한다. 이 유틸리티는 주어진 타입의 모든 하위 타입 집합을 나타내는 타입을 반환한다.

<br />

## `Required<T>`

```tsx
type Required<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

`T`의 모든 프로퍼티가 필수로 설정된 타입을 구성한다.

<br />

## `Readonly<T>`

```tsx
type Readonly<T> = { readonly [P in keyof T]: T[P]; }
```

`T`의 모든 프로퍼티를 읽기 전용(`readonly`)으로 설정한 타입을 구성한다. 즉 생성된 타입의 프로퍼티는 재할당할 수 없다.

<br />

## `Record<K, T>`

```tsx
type Record<K extends string | number | symbol, T> = { [P in K]: T; }
```

타입 `T`의 프로퍼티의 집합 `K`로 타입을 구성한다. 이 유틸리티는 타입의 프로퍼티들을 다른 타입에 매핑시키는 데 사용될 수 있다.

<br />

## `Pick<T, K>`

```tsx
type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
```

`T`에서 프로퍼티 `K`의 집합을 선택해 타입을 구성한다.

<br />

## `Exclude<T, U>`

```tsx
type Exclude<T, U> = T extends U ? never : T
```

`T`에서 `U`에 할당할 수 있는 모든 속성을 제외한 타입을 구성한다.

<br />

## `Omit<T, K>`

```tsx
type Omit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P];
};
```

`T`에서 모든 프로퍼티를 선택한 다음 `K`를 제거한 타입을 구성한다.

<br />

## `Extract<T, U>`
```tsx
type Extract<T, U> = T extends U ? T : never
```

`T`에서 `U`에 할당 할 수 있는 모든 속성을 추출하여 타입을 구성한다.

<br />

## `NonNullable<T>`

```tsx
type NonNullable<T> = T extends null ? never : T
```

`T`에서 `null` 과 `undefined`를 제외한 타입을 구성한다.

<br />

## `Parameters<T>`

```tsx
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

함수 타입 `T`의 매개변수 타입들의 튜플 타입을 구성한다.

<br />

## `ReturnType<T>`

```tsx
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

함수 `T`의 반환 타입으로 구성된 타입을 만든다.

<br />

## `ConstructorParameters<T>`

```tsx
type ConstructorParameters<
  T extends abstract new (...args: any) => any
> = T extends abstract new (...args: infer P) => any ? P : never
```

`ConstructorParameters<T>` 타입은 생성자 함수 타입의 모든 매개변수 타입을 추출할 수 있게 해준다. 모든 매개변수 타입을 가지는 튜플 타입(`T`가 함수가 아닌 경우 `never`)을 생성한다.


<br />

## `InstanceType<T>`

```tsx
type InstanceType<
  T extends abstract new (...args: any) => any
> = T extends abstract new (...args: any) => infer R ? R : any
```

생성자 함수 타입 `T`의 인스턴스 타입으로 구성된 타입을 만든다.

<br />

## `ThisParameterType<T>`

```tsx
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any
  ? U
  : unknown;
```

함수 타입의 `this` 매개변수의 타입, 혹은 함수 타입에 `this` 매개변수가 없을 경우 `unknown`을 추출한다.

> 유의: 이 타입은 `--strictFunctionTypes`가 활성화되었을 때만 올바르게 동작합니다. [#32964](https://github.com/microsoft/TypeScript/issues/32964)를 참고하세요.

<br />

## `OmitThisParameter<T>`

```tsx
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T;
```

함수 타입에서 `this` 매개변수를 제거한다.

> 유의: 이 타입은 `--strictFunctionTypes`가 활성화되었을 때만 올바르게 동작합니다. [#32964](https://github.com/microsoft/TypeScript/issues/32964) 참고하세요.

<br />

## `ThisType<T>`

```tsx
type ThisType<T> = {}
```

이 유틸리티는 변형된 타입을 반환하지 않는다. 대신, 문맥적 `this` 타입에 표시하는 역할을 한다. 

유의: 이 유틸리티를 사용하기 위해선 `--noImplicitThis` 플래그를 사용해야 한다는 것을 유의하세요.
