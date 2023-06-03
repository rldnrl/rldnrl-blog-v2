---
title: 이터러블과 이터레이터
date: '2021-9-27'
tags: ['javascript']
draft: false
summary: 이터러블과 이터레이터에 대해서 알아보자.
---

## 이터러블/이터레이터 프로토콜

- 이터러블: 이터레이터를 리턴하는 `[Symbol.iterator]()` 를 가진 값
- 이터레이터: `{ value, done }` 객체를 리턴하는 `next()` 를 가진 값
- 이터러블/이터레이터 프로토콜: 이터러블을 `for...of`, 전개 연산자 등과 함께 동작하도록한 규약

```tsx
const array = [1, 2, 3, 4]

for (const element of array) {
  console.log(element)
}
```

`for ... of` 문법은 `Symbol.iterator` 속성을 가지는 컬렉션에 대해서 반복을 할 수 있다는 특징이 있다. 즉 Iterable한 객체에 대해서 사용할 수 있다는 뜻이다. JavaScript에서 Iterable한 객체는 `Symbol.iterator`를 속성으로 가지고 있고 `iterator`를 반환하는 객체를 뜻한다.

<img src="/static/images/js/iterable-iterator1.jpg" />

앞서 말한대로 `Symbol.iterator`를 속성으로 가지고 있으며, **Iterator를 반환하는 객체를 Iterable 객체**라고 한다.

`[Symbol.iterator]()` 객체로 반환하는 iterator 객체는 `next` 메소드를 가지고 있으며, `next` 메소드는 반환값으로 iterator 종료가 되었는가에 대한 플래그인 `done`과 값을 나타내는 `value` 두 가지를 반환한다. 이런 규칙을 **Iterator Protocol (이터레이터 프로토콜)**이라고 한다.

일반적으로 아래와 같이 하나의 객체에 Iterator Protocol과 Iterable Protocol을 구현한다.

```tsx
const iterator = {
  [Symbol.iterator]() {
    return this
  },
  next() {
    return { done: false, value: 'Hello' }
  },
}

console.log(iterator[Symbol.iterator]()) // this 반환
console.log(iterator[Symbol.iterator]() === iterator) // true
console.log(iterator.next()) // Object { done: false, value: "Hello" }
```

## `Array`, `Set`, `Map`을 비교해보자

### `Array`

```tsx
const array = [1, 2, 3]

for (const element of array) {
  console.log(element)
}
```

<img src="/static/images/js/iterable-iterator2.jpg" />

<br />

### `Set`

```tsx
const set = new Set([1, 2, 3])

for (const element of set) {
  console.log(element)
}
```

<img src="/static/images/js/iterable-iterator3.jpg" />

<br />

### `Map`

```tsx
const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
])

for (const element of map) {
  console.log(element)
}
```

<img src="/static/images/js/iterable-iterator4.jpg" />
