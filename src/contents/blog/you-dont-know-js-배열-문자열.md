---
title: You don't know JS - 배열, 문자열
date: '2022-03-20'
tags: ['JavaScript']
draft: false
summary: You don't know JS에서 값에서 배열과 문자열에 대해서 알아봅시다.
---

이번 시간에는 값에 대해서 살펴볼 겁니다. 숫자 타입이 엄청 많으므로, 따로 정리할 예정입니다. 그러면 배열과 문자열에 대해서 알아봅습니다.

## 배열

JavaScript에서 배열은 어떤 타입의 값이라도 담을 수 있습니다.

```js
let arr = [1, '2', [3]]

arr.length // 3
arr[0] === 1 // true
arr[2][0] === 3 // true
```

배열의 크기는 미리 지정하지 않고 선언할 수 있으며, 원하는 값을 추가하면 됩니다.

```js
let arr = []

arr.length // 0
arr[0] = 1
arr[1] = '2'
arr[2] = [3]

arr.length // 3
```

구멍난 배열을 다룰 때는 조심해야합니다.

```js
let arr = []

arr[0] = 1
arr[2] = 3

arr[1] // undefined

arr.length // 3

arr
// Node.js. [ 1, <1 empty item>, 3 ]
// Browser. [1, 비어 있음, 3]
```

이것은 명시적으로 `arr[1] = undefined`를 한 것과는 완전히 다릅니다.

배열은 숫자를 `key`로 하는 객체입니다. 그런데, `key`에 문자열을 할당할 수 있습니다. (하지만 `length`가 증가하지 않습니다.)

```js
let arr = []

arr[0] = 1
arr['foo'] = 2

arr.length // 1
arr['foo'] // 2
arr.foo // 2
```

그런데 key로 넣은 문자열이 표준 10진수 숫자로 타입이 바뀌면, 문자열의 키가 아닌 숫자 키를 사용한 것 같은 결과가 나타납니다.

```js
let arr = []

arr['13'] = 43

a.length = 14
```

## 문자열

문자열은 생김새가 배열과 비슷합니다. 배열의 일부 메서드(`length, indexOf(), concat()`)를 빌려쓸 수 있기 때문이죠.

```js
let str = 'foo'
let arr = ['f', 'o', 'o']

str.length // 3
arr.length // 3

str.indexOf('f') // 0
arr.indexOf('f') // 0

let newStr = str.concat('bar')
let newArr = arr.concat(['b', 'a', 'r'])

str === newStr // false
arr === newArr // false
```

문자열과 배열의 다른 점은 문자열은 원시 타입이고, 배열은 레퍼런스 타입이라는 점입니다. 원시 타입의 특징 중에 "불변"이라는 특징이 있었죠? 따라서 문자열은 직접적으로 변경할 수 없다는 점이 다릅니다.

```js
let str = 'foo'
str[1] = 'O'
str // foo
```

문자열은 불변이기 때문에 항상 새로운 값을 반환합니다.

```js
let str = 'foo'
let upperCaseStr = str.toUpperCase()

str // foo
upperCaseStr // FOO
```

자, 그러면 문자열은 배열의 어떤 메서드를 사용할 수 있을까요?

바로 _새로운 값을 반환하는 메서드_ 만 이용할 수 있습니다. 그리고 불변 메서드를 빌려쓰는 것 또한 가능합니다

```js
let str = 'foo'

let strWithDash = Array.prototype.join.call(str, '-')
let strWithMap = Array.prototype.map
  .call(str, function (v) {
    return v.toUpperCase()
  })
  .join('')

strWithDash // f-o-o
strWithMap // FOO
```

## 마무리

오늘은 문자열과 배열에 대해서 정리해봤는데요. 예전에는 문자열에서 사용할 수 있는 메서드들이 헷갈렸었는데, 이제는 왜 이런 메서드들이 있는지, 이해가 갑니다. 중요한 키워드는 **배열은 가변, 문자열은 불변** 이라는 겁니다. 배열에 대해서는 레퍼런스 타입을 다룰 때 더 자세히 정리해보겠습니다. 다음에는 숫자에 대해서 정리해보겠습니다.
