---
title: JavaScript에서 this
date: '2021-11-27'
tags: ['javascript', 'this']
draft: true
summary: JavaScript 개발자를 괴롭게(?)하는 게 바로 this이다. 나도 아직 제대로 모르는 것 같아서 정리해봤다.
---

JavaScript에서 함수의 `this` 키워드는 다른 언어와 조금 다르게 동작합니다. 또한 엄격 모드와 비엄격 모드에서도 일부 차이가 있습니다.

대부분의 경우 `this`의 값은 함수를 호출한 방법에 의해 결정됩니다. 실행 중에는 할당으로 설정할 수 없고, 함수를 호출할 때마다 다를 수 있습니다. ES5는 함수를 어떻게 호출했는지 상관하지 않고 `this` 값을 설정할 수 있는 `bind` 메서드를 도입했고, ES2015는 스스로의 `this` 바인딩을 제공하지 않는 화살표 함수를 추가했다(이는 렉시컬 컨텍스트 안의 `this`값을 유지합니다).

## 값
실행 컨텍스트(`global`, `function` 또는 `eval`)의 프로퍼티는 비엄격 모드에서 항상 객체를 참조하며, 엄격 모드에서는 어떠한 값이든 될 수 있습니다.

## Global Context
전역 실행 맥락에서 `this`는 엄격 모드 여부에 관계 없이 전역 객체를 참조합니다.

```js
// 웹 브라우저에서는 window 객체가 전역 객체
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b)  // "MDN"
console.log(b)         // "MDN"
```

## Function Context
함수 내부에서 `this`의 값은 함수를 호출한 방법에 의해 좌우됩니다.

### 단순 호출
다음 예제는 엄격 모드가 아니며 `this`의 값이 호출에 의해 설정되지 않으므로, 기본값으로 브라우저에서는 `window`인 전역 객체를 참조합니다. 아래의 예제를 봅시다.

```js
function f1() {
  return this;
}

// 브라우저
f1() === window; // true

// Node.js
f1() === global; // true
```

반면에 엄격 모드에서 `this` 값은 실행 문맥에 진입하며 설정되는 값을 유지하므로 다음 예시에서 보여지는 것 처럼 `this`는 `undefined`로 남아있습니다. 아래의 예제를 봅시다.

```js
function f2(){
  "use strict"; // 엄격 모드 참고
  return this;
}

f2() === undefined; // true
```

두번째 예제에서 `f2`를 객체의 메서드나 속성(예: `window.f2()`)으로써가 아닌 직접 호출했기 때문에  `this`는 `undefined`여야 합니다. 그러나 엄격 모드를 처음 지원하기 시작한 초기 브라우저에서는 구현하지 않았고, `window` 객체를 잘못 반환했습니다.

`this`의 값을 한 문맥에서 다른 문맥으로 넘기려면 다음 예시와 같이 `call()`이나 `apply()`를 사용해야합니다.

```js
// call 또는 apply의 첫 번째 인자로 객체가 전달될 수 있으며 this가 그 객체에 묶임
var obj = {
  a: 'Custom'
};

// 변수를 선언하고 변수에 프로퍼티로 전역 window를 할당
var a = 'Global';

function whatsThis() {
  return this.a;  // 함수 호출 방식에 따라 값이 달라짐
}

whatsThis();          // this는 'Global'. 함수 내에서 설정되지 않았으므로 global/window 객체로 초기값을 설정한다.
whatsThis.call(obj);  // this는 'Custom'. 함수 내에서 obj로 설정한다.
whatsThis.apply(obj); // this는 'Custom'. 함수 내에서 obj로 설정한다.
```

```js
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {
  a: 1,
  b: 3
};

// 첫 번째 인자는 'this'로 사용할 객체이고,
// 이어지는 인자들은 함수 호출에서 인수로 전달된다.
add.call(o, 5, 7); // 16

// 첫 번째 인자는 'this'로 사용할 객체이고,
// 두 번째 인자는 함수 호출에서 인수로 사용될 멤버들이 위치한 배열이다.
add.apply(o, [10, 20]); // 34
```

비엄격 모드에서 `this`로 전달된 값이 객체가 아닌 경우, `call`과 `apply`는 이를 객체로 변환하기 위한 시도를 합니다. `null`과 `undefined` 값은 전역 객체가 됩니다. 7이나 'foo'와 같은 원시값은 관련된 생성자를 사용해 객체로 변환되며, 따라서 원시 숫자 7은 `new Number(7)`에 의해 객체로 변환되고 문자열 'foo'는 `new String('foo')`에 의해 객체로 변환됩니다.

```js
function bar() {
  console.log(Object.prototype.toString.call(this));
}

bar.call(7);     // [object Number]
bar.call('foo'); // [object String]
bar.call(undefined); // [object global]
```

### bind 메서드
ECMAScript5는 `Function.prototype.bind`를 도입했습니다. `f.bind(someObject)`를 호출하면 `f`와 같은 본문(코드)과 범위를 가졌지만 `this`는 원본 함수를 가진 새로운 함수를 생성합니다. 새 함수의 `this`는 호출 방식과 상관없이 영구적으로 `bind()`의 첫 번째 매개변수로 고정됩니다.

```js
function f() {
  return this.a;
}

var g = f.bind({
  a: 'azerty'
});
console.log(g()); // azerty

var h = g.bind({
  a: 'yoo'
}); // bind는 한 번만 동작함!
console.log(h()); // azerty

var o = {
  a: 37,
  f: f,
  g: g,
  h: h
};
console.log(o.a, o.f(), o.g(), o.h()); // 37, 37, azerty, azerty
```

### 화살표 함수
화살표 함수에서 `this`는 자신을 감싼 정적 범위입니다. 전역 코드에서는 전역 객체를 가리킨다.

```js
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true
```

*참고: 화살표 함수를 `call()`, `bind()`, `apply()`를 사용해 호출할 때 `this`의 값을 정해주더라도 무시합니다. 사용할 매개변수를 정해주는 건 문제 없지만, 첫 번째 매개변수(thisArg)는 `null`을 지정해야 합니다.

```js
// 객체로서 메서드 호출
var obj = {func: foo};
console.log(obj.func() === globalObject); // true

// call을 사용한 this 설정 시도
console.log(foo.call(obj) === globalObject); // true

// bind를 사용한 this 설정 시도
foo = foo.bind(obj);
console.log(foo() === globalObject); // true
```