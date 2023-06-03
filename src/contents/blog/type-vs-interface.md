---
title: Type vs Interface
date: '2021-9-26'
tags: ['typescript']
draft: false
summary: 내가 회사에 타입스크립트를 제대로 도입하기 위해 공부를 했는데, 공통적으로 가장 많이 받은 질문이 "Type과 Interface의 차이가 뭔가요?"라는 것이었다. 물론 나도 궁금했다. 이 글은 둘의 차이점을 정리한 내용이다.
---

내가 회사에 타입스크립트를 제대로 도입하기 위해 공부를 했는데, 공통적으로 가장 많이 받은 질문이 "Type과 Interface의 차이가 뭔가요?"라는 것이었다. 물론 나도 궁금했다. 이 글은 둘의 차이점을 정리한 내용이다.

## Type Alias은 확장에 닫혀 있고, Interface는 확장에 열려 있다.

### Type Alias

```tsx
type User = {
  firstName: string
  lastName: string
  age: number
}

// Error!!! Duplicate identifier 'User'
type User = {
  email: string
}
```

### Interface

```tsx
interface User {
  firstName: string
  lastName: string
  age: number
}

interface User {
  email: string
}
```

결과

```tsx
interface User = {
  firstName: string
  lastName: string
  age: number
  email: string
}
```

<br />

## Type Alias는 확장할 때 `&`를 사용한다.

```tsx
type BirdType = {
  wings: number
}

type Owl = { nocturnal: true } & BirdType
type Robin = { nocturnal: false } & BirdInterface
```

## Interface는 `extends` 키워드를 사용한다. 둘 다 교차하여 사용할 수 있다.

```tsx
type BirdInterface = {
  wings: number
}

interface Peacock extends BirdType {
  colorful: true
  flies: false
}
interface Chicken extends BirdInterface {
  colorful: false
  flies: false
}
```

<br />

## Type Alias를 통해 `implements`를 사용할 경우, Union 타입이 들어간 것은 사용할 수 없다.

```tsx
type Name = {
  firstName: string
  lastName: string
}

type UserInfo =
  | Name
  | {
      age: number
    }

// Error!!! A class can only implement an object type
// or intersection of object types with statically known members.
class User implements UserInfo {}
```

<br />

## Type Alias를 통해 `extends`를 사용할 경우, Union 타입이 들어간 것은 사용할 수 없다.

```tsx
type Name = {
  firstName: string
  lastName: string
}

type UserInfo =
  | Name
  | {
      age: number
    }

// Error!!! 'UserInfo' only refers to a type, but is being used as a value here.
class User extends UserInfo {}
```
