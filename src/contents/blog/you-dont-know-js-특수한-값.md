---
title: You don't know JS - 특수한 값
date: '2022-06-01'
tags: ['JavaScript']
draft: false
summary: You don't know JS에서 특수한 값에 대해서 정리했습니다.
---

## Undefined
`undefined` 타입의 값을 `undefined` 밖에 없습니다. 신기하게도 `undefined`라는 변수를 선언할 수 있습니다.

```js
function func() {
  var undefined = 2
  console.log(undefined)
}
```

위의 예제는 절대 하지 말라고 보여주는 예시입니다.

## void 연산자
`undefined`는 내장 식별자로 값은 `undefined`이지만, 이 값은 `void` 연산자로도 얻을 수 있습니다. 표현식 `void __`는 어떤 값이든 "무효로 만들어" 항상 결과값을 `undefined`로 만듭니다. 기존 값은 건들이지 않고, 연산 후 값은 복구할 수 없습니다.

```js
var a = 42

console.log(void a, a) // undefined 42
```

관례에 따라서 `void`만으로 `undefined` 값을 나타내려면 `void` 이라고 씁니다. `void 0`, `void 1`, `void undefined` 모두 같습니다.

`void` 연산자는 어떤 표현식의 결괏값이 없다는 것을 확실히 밝혀야할 때 유용합니다. 바로 아래와 같이 말입니다.

```js
function doSomething() {
  if (!App.ready) {
    return void setTimeout(doSomething, 100)
  }

  var result

  return result
}

if (doSomething()) {
  // 다음 작업 바로 실행
}
```

하지만 보통은 이렇게 사용하지 않고 **Early Return** 하는 방식을 많이 사용하죠.

```js
if (!App.ready) {
  setTimeout(doSomething, 100)
  return
}
```

정리하자면, `void` 연산자는 값이 존재하는 곳에서 그 값이 `undefined`가 되어야 좋을 경우에만 사용하는 것이 좋습니다.

## NaN 누구니?

`NaN`의 타입은 이상하게 `number` 입니다. 이것은 매우 특수한 값입니다.

```js
typeof NaN === 'number' // true
```

일단 `NaN`의 의미는 `유효하지 않은 숫자`로 표현하는 게 정확합니다.

`NaN`을 일으키는 연산 두개를 비교하면 어떤 일이 일어날까요?

```js
const num = 1 / 'foo'
num == NaN // false
num === NaN // false
```

`NaN`은 아주 귀합니다. 그렇기 때문에 자기 자신과도 동일하지 않습니다. 이것을 **반사성이 없는 값**이라고 합니다.

```js
NaN !== NaN // true
```

비교 불능이라면 어떻게 비교할까요?

바로 `Number.isNaN()`을 사용하면 됩니다.(`isNaN()`을 사용하지 마세요. `isNaN()`은 숫자 이외의 타입을 `true`로 반환해버립니다.)

```js
const num = 2 / 'foo'
const str = 'foo'

Number.isNaN(num) // true
Number.isNaN(str) // false - string이기 때문이죠.
```

`NaN`은 자기 자신과 동등하지 않은 유일무이한 값입니다.(세상 언어 통틀어서 이런 값은 없을 겁니다.)

### 무한대
보통은 `0`으로 나누기를 한다면 에러가 발생할 겁니다. 하지만 자바스크립트는 그렇지 않습니다. `Infinity`라는 결과값이 나옵니다.

```js
var a = 1 / 0 // Infinity
var b = -1 / 0 // -Infinity
```

그렇다면, "무한대 / 무한대"는 무엇일까? 보통은 `1`일 것이라고 생각하지만, 자바스크립트는 수행할 수 없는 연산으로 판단해 `NaN`이 됩니다.

## 0

자바스크립트는 `0`을 다루는 방식이 특이합니다. 아래 코드를 한 번 봅시다.

```js
var a = 0 / -3 // -0
var b = 0 * -3 // -
```

덧셈과 뺄셈에서는 `-0`이 나올 일이 없습니다. 재밌는 사실은 문자열화 하면 `"0"`이 나옵니다.

```js
var a = 0 / -3 // -0

a.toString() // "0"
String(a) // "0"

JSON.stringify(a) // "0"
```

하지만 반대로 할 경우, `-0`을 그대로 보여줍니다.

```js
+"-0" // -0
Number("-0") // -0
JSON.parse("-0") // -0
```

비교 연산자를 한 번 수행해볼까요?

```js
var a = 0
var b = -0


a == b // true
-0 == 0 // true

a === b // true
-0 === 0 // true

0 > -0 // false
a > b // false
```

그렇다면 `-0`을 판단하는 유틸리티 함수를 만들어봅시다

```js
function isNegZero(n) {
  n = Number(n)
  return (n === 0) && (1 / n === -Infinity)
}

isNegZero(-0) // true
isNegZero(0 * -3) // true
isNegZero(0) // false
```

## 특이한 동등 비교

`Object.is`를 활용한다면 위에서 봤던 `NaN` 비교함수, `isNegZero`를 사용하지 않아도 됩니다.

```js
var a = 1 / "foo"
var b = 0 * -3

Object.is(a, NaN) // true
Object.is(b, -0) // true
Object.is(b, 0) // false
```

`Object.is` 연산자는 특이한 동등 비교를 할 때 유용합니다.

다음 시간에는 값과 레퍼런스에 대해서 정리해보겠습니다.