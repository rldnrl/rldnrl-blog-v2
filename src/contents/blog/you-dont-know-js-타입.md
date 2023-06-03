---
title: You don't know JS - 타입
date: '2022-03-12'
tags: ['JavaScript']
draft: false
summary: You don't know JS에서 타입에 대해서 정리했습니다.
---

저는 TypeScript를 좋아하는데요, 정적 타이핑을 좋아하고 할 수 있는 것이 많기 때문입니다. 하지만 JavaScript의 Superset이기 때문에 JavaScript에 대해서 알아야할 필요성을 느꼈습니다. 그래서 앞으로 You don't know JS 시리즈를 공부하면서 정리할 예정입니다.

## JavaScript의 타입

JavaScript에는 7가지의 타입이 있습니다.

- null
- undefined
- string
- number
- boolean
- object
- symbol (ES6. 나중에 알아보도록 합시다.)

타입을 확인하는 방법은 `typeof`를 이용하면 됩니다. 확인해볼까요?

```js
var a = 'abc'
typeof a === 'string' // true
var b = 5
typeof b === 'number' // true
var c = true
typeof c === 'boolean' // true
```

## null은 무슨 타입일까요?

`null` 타입은 바로 `object` 타입입니다. 이것은 JavaScript의 최대 실수라고도 하죠.

```js
typeof null === 'object' // true
```

## function 타입은 뭘까요?

사실 저 위에 없는 타입이 하나 더 있습니다. 바로 `function` 타입인데요. 이 타입은 `object`의 하위 타입이라고 합니다. 구체적으로 **함수는 호출 가능한 객체(내부 프로퍼티 `[[Call]]`로 호출할 수 있는 객체)** 라고 명시되어 있습니다.

함수는 객체라서 유용합니다. 함수에 프로퍼티를 둘 수 있기 때문이죠.

```js
function handler(a, b) {
  // ...
}
```

함수 `handler`에 선언된 인자 개수는 함수 객체의 `length` 프로퍼티로 알 수 있습니다.

```js
handler.length // 2
```

## 배열은 무슨 타입일까요?

배열은 `object` 타입입니다.

```js
typeof [1, 2, 3] // 'object'
```

배열은 숫자 인덱스를 가지며, `length` 프로퍼티가 자동으로 관리되는 등의 추가 특성을 지닌, 객체의 하위 타입입니다.

## 원시 타입은 불변이다.

원시 타입이라고 하면 `string, number, boolean, null, undefined, symbol`이 있습니다. JavaScript 개발자라면 "원시 타입은 불변이다"라는 말을 많이 들었을 겁니다. 이건 무슨 뜻일까요?

이것은 메모리에 값이 할당되면 해당 메모리에 할당된 값을 변경하지 못한다는 얘기입니다.

예를 들어봅시다.

```js
var a = 'abc'
```

위와 같이 선언하면 `'abc'`라는 값이 0x0001이라는 주소에 할당이 됩니다. 그렇다면 `a`는 어떤 걸 갖고 있는 걸까요? 바로 `abc`의 주소(0x0001)를 갖고 있게 됩니다. (이것은 변수 영역과 값의 영역을 분리해서 생각해야합니다.)

만약에 `a` 변수에 다른 값을 할당하면 `'abc'`가 바뀌는 걸까요? 아닙니다. 새로운 주소에 값을 할당하고, 그 주소를 `a` 변수가 갖고 있게 됩니다.

```js
var a = 'abc'
a = 5
```

위와 같이 `a = 5`라고 선언을 하게 되면, `5`가 0x0002 영역에 할당이 되고, `a`가 그 주소(0x0002)를 저장합니다. 만약에 프로그램에서 `'abc'`가 사용되지 않고 있다면, 가비지 컬렉터가 수집합니다.

이처럼 JavaScript는 값이 메모리에 할당이 되고, 변수가 그 값의 주소를 저장하는 방식으로 동작합니다. 메모리에 할당된 값 자체를 변경할 수 없다는 점에서 원시 타입은 불변이라고 하는 겁니다.

## 값이 없는 vs 선언되지 않은

이것은 `undefined`와 `undeclared`를 구분하는 것인데요. 두 개는 완전히 다릅니다.

```js
var a
a // undefined
b // Uncaught ReferenceError: b is not defined
```

`a`는 변수를 선언하고 값을 할당하지 않았습니다. 그래서 `undefined`를 반환한 겁니다. 반면에 `b`는 변수를 선언하지 않았습니다. 그래서 `b`라는 변수는 없다고 에러를 출력하는 겁니다.

자, 그러면 `typeof`를 연산 결과를 한 번 봅시다.

```js
var a
typeof a // undefined
typeof b // undefined
```

선언되지 않은 변수 `b`에 `typeof를` 하게 되면 `undefined`가 출력됩니다. 아주 헷갈리게 되어 있네요. 하지만 `typeof` 연산자가 쓸모 있습니다. 왜냐하면 선언되지 않은 변수에 대해서 바로 사용하지 않고 `typeof`로 체크할 수 있기 때문이죠.

오늘은 간단하게 JavaScript가 어떤 타입을 갖고 있는지, "원시 타입은 불변이다"라는 말이 어떤 뜻인지, "값이 없는 것"과 "선언 되지 않은 것"이 어떤 차이가 있는지 알아봤습니다. 다음 시간에는 값에 대해서 한 번 정리해보겠습니다.
