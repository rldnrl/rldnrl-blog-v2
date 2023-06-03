---
title: You don't know JS - 숫자
date: '2022-03-24'
tags: ['JavaScript']
draft: false
summary: You don't know JS에서 숫자에 대해서 정리했습니다.
---

## 숫자

JavaScript의 숫자 타입은 `number`가 유일합니다. 이것은 정수, 부동 소수점 모두를 포함합니다.

숫자 리터럴을 다음과 같이 10진수 리터럴로 표현합니다.

```js
let num1 = 42
let num2 = 42.3
```

소수점 앞 정수가 0이면 생략이 가능합니다.

```js
let num1 = 0.42
let num2 = 0.42
```

소수점 이하가 0일 때도 생략 가능합니다.

```js
let num1 = 42.0
let num2 = 42
```

대부분의 숫자는 10진수가 기본입니다. 소수점 이하 0은 뗍니다.

```js
let num1 = 42.3
let num2 = 42.0

num1 // 42.3
num2 // 42
```

아주 크거나 아주 작은 숫자는 지수형으로 표시하며, `toExponential()` 메서드의 결과값과 같습니다.

```js
let num1 = 5e10 // 5 * 10^10
num1.toExponential() // '5e+10'(이상하게 문자열로 반환됩니다.)

let num2 = num1 ** 2
num2 // 2.5e+21

let num3 = 1 / num1
num3 // 2e-11
```

숫자 값은 `Number` 객체 래퍼로 박싱할 수 있기 때문에 `Number.prototype` 메서드로 접근할 수도 있습니다.

예를 들어, `toFixed()`와, `toPrecision()`을 사용할 수 있습니다.

```js
let num1 = 42.59

// toFixed(): 지정한 소수점 이하 자리수까지 나타낸다.
num1.toFixed(0) // '43'
num1.toFixed(1) // '42.6'
num1.toFixed(2) // '42.59'
num1.toFixed(3) // '42.590'
num1.toFixed(4) // '42.590'

// toPrecision(): 유효 숫자 개수를 지정한다.
num1.toPrecision(1) // '4e+1'
num1.toPrecision(2) // '43'
num1.toPrecision(3) // '42.6'
num1.toPrecision(4) // '42.59'
num1.toPrecision(5) // '42.590'
```

두 메서드는 숫자 리터럴에서 바로 접근할 수 있으므로 변수를 만들어 할당하지 않아도 됩니다. 하지만 `.`이 소수점일 경우에는 프로퍼티 접근자가 아닌 숫자 리터럴의 일부로 해석되므로 주의해야합니다.

```js
// 잘못된 구문
42.toFixed()

// 올바른 구문
(42).toFixed(3) // '42.000'
0.42.toFixed(3) // '0.420'
42..toFixed(3) // '42.000'
```

위와 같이 개발할 경우 동료 개발자의 눈을 메마르게 하니 피합시다.

큰 숫자는 보통 지수형으로 표시합니다.

```js
const oneThousand = 1e3 // 1 * 10^3
const oneMillionOneHundredThousand = 1.1e6 // 1.1 * 10^6
```

숫자 리터럴은 2진, 8진, 16진 등으로 다른 진법으로 나타낼 수 있습니다.

```js
0xf3 // 16진수
0Xf3 // 16진수

0o363 // 8진수
0O363 // 8진수

0b11110101 // 2진수
0B11110011 // 2진수
```

진법을 활용할 때는 소문자로 하는 것이 좋습니다. (`0O363`은 동료의 눈을 메마르게 할 수 있습니다.)

### 작은 소수 값

다음은 널리 알려진 부동 소수점의 문제입니다.(이것은 자바스크립트만의 문제가 아닙니다.)

```js
0.1 + 0.2 === 0.3 // false
```

수식만 보면 `true`이지만 결과는 `false`가 나옵니다. 왜 그럴까요?

이것은 `0.1 + 0.2`가 `0.30000000000000004`에 가깝기 때문입니다.

그렇다면 `0.1 + 0.2`와 `0.3`을 어떻게 비교해야하는 걸까요? 일반적으로 **반올림 오차** 를 허용하는 **허용 공차** 로 처리하는 방법이 있습니다. 이런 미세한 오차를 *머신 입실론* 이라고 하는데, JavaScript의 머신 입실론은 `2^(-52)` 입니다. ES6부터는 이 값이 `Number.EPSILON`으로 미리 정의되어 있습니다.

```js
function equal(a, b) {
  return Math.abs(a - b) < Number.EPSILON
}

const a = 0.1 + 0.2
const b = 0.3
equal(a, b) // true
```

부동 소수점의 최댓값은 `Number.MAX_VALUE`로 정의하며, 최솟값은 `Number.MIN_VALUE`로 정의한다.

### 안전한 정수 범위
JavaScript 정수는 `Number.MAX_VALUE`보다 훨씬 작은 수준에서 안전 값의 범위가 정해져 있습니다. *안전하게* 표현할 수 있는 정수의 범위는 `2^53 - 1` 입니다. 이 값은 ES6에서 `Number.MAX_SAFE_INTEGER`로 정의합니다. 최솟값은 `Number.MIN_SAFE_INTEGER`으로 정의합니다.

JavaScript는 DB에서 64비트 ID를 처리할 때 정확하게 표현할 수 없으므로 string 타입으로 저장해야합니다.

### 정수인지 확인하기
ES6부터 `Number.isInteger()`를 사용하면 정수 여부를 확인할 수 있습니다.

```js
Number.isInteger(42) // true
Number.isInteger(42.000) // true
Number.isInteger(42.9) // false
```

안전한 정수 여부도 체크할 수 있습니다. 바로 `Number.isSafeInteger()`를 사용하면 됩니다.

```js
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Math.pow(2, 53)) // false
Number.isSafeInteger(Math.pow(2, 53) - 1) // false
```

## 마무리
오늘은 숫자 값에 대해서 배웠는데요. `number` 타입 하나로 모든 걸 다 처리하려니 힘들겠네요. 다음 시간에는 특수한 값들에 대해서 정리해볼 예정입니다.