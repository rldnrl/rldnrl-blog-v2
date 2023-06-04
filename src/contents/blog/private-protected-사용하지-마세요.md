---
title: private, protected 사용하지 마세요.
date: '2022-02-05'
tags: ['typescript']
draft: false
summary: TypeScript에서 private, protected 키워드를 사용하면 안 되는 이유를 알아봅시다.
---

TypeScript의 코드 스타일이 Java와 많이 비슷해지고 있습니다. 그러나 TypeScript는 JavaScript의 Superset 언어라는 것을 잊지 말아야합니다. 본격적으로 `class`를 사용할 때 `private`, `protected`를 사용하지 말아야하는 이유를 알아봅시다.

## `private`, `protected`는 TypeScript 문법입니다.

`private`, `protected`는 TypeScript 문법입니다. 즉, 트랜스파일링 되면 사라집니다.

```ts
class Secret {
  private _password = '접근하면 할 수 없습니다.'
}

const secret = new Secret()
secret._password // Property '_password' is private and only accessible within class 'Secret'.
```

TypeScript에서는 에러를 아주 잘 나타내줍니다. 자, 그러면 JavaScript로 변환을 해봅시다.

```js
class Secret {
  constructor() {
    this._password = '접근하면 할 수 없습니다.';
  }
}

const secret = new Secret();
console.log(secret._password); // '접근하면 할 수 없습니다.'가 출력됩니다.
```

JavaScript로 변환한 결과, `private` 키워드는 사라졌고, `_password`에 접근할 수 있게 되었습니다. TypeScript의 접근 제어자들은 컴파일 시점에서만 오류를 표시해줄 뿐, 런타임에서는 아무런 효과가 없습니다.

그렇다면, 정보를 감추기 위해서는 어떻게 해야할까요?

## 방법 1. 클로저를 사용하세요.

```ts
class PasswordChecker {
  checkPassword: (password: string) => boolean
  constructor(passwordHash: number) {
    this.checkPassword = (password: string) => hash(password) === passwordHash
  }
}

const checker = new PasswordChecker(hash('123qwe'))
checker.checkPassword('123qwe')
```

`PasswordChecker`의 생성자 외부에서 `passwordHash` 변수에 접근할 수 없기 때문에 정보를 숨기는 목적을 달성했습니다. 그런데 몇 가지 주의 사항이 있습니다. `passwordHash`를 생성자 외부에서 접근할 수 없기 때문에 `passwordHash`에 접근하는 메서드 역시 생성자 내부에 존재하게 됩니다. 그러면 인스턴스를 생성할 때마다 각 메서드의 복사본이 생성되기 때문에 메모리 낭비를 하게 됩니다. 또한 동일한 클래스로 부터 생성된 인스턴스라고 하더라도 서로의 비공개 데이터에 접근하는 것이 불가능하기 때문에 철저하게 비공개이면서도 불편함이 따르게 됩니다.

## 방법 2. Babel Stage-3 문법의 `#`을 사용하세요.

```ts
class PasswordChecker {
  #passwordHash: number

  constructor(passwordHash: number) {
    this.#passwordHash = passwordHash
  }

  checkPassword(password: string) {
    return hash(password) === this.#passwordHash
  }
}

const checker = new PasswordChecker(hash('123qwe'))
checker.checkPassword('123qwe') // true
checker.checkPassword('890uio') // false
```

```js
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PasswordChecker_passwordHash;
class PasswordChecker {
    constructor(passwordHash) {
        _PasswordChecker_passwordHash.set(this, void 0);
        __classPrivateFieldSet(this, _PasswordChecker_passwordHash, passwordHash, "f");
    }
    checkPassword(password) {
        return hash(password) === __classPrivateFieldGet(this, _PasswordChecker_passwordHash, "f");
    }
}
_PasswordChecker_passwordHash = new WeakMap();

const checker = new PasswordChecker(hash('123qwe'));
checker.checkPassword('123qwe'); // true
checker.checkPassword('890uio'); // false
```

`#passwordHash` 속성은 클래스 외부에서 접근할 수 없습니다. 그러나 클로저와 다르게 클래스 메서드나 동일한 클래스의 개별 인스턴스끼리는 접근이 가능합니다.

## 요약

- 정보를 감추는 목적으로 `private`, `protected` 연산자를 사용하지 마세요. 런타임에서는 접근할 수 있습니다.
- 비공개 데이터로 만들고 싶다면 클로저를 사용하세요.
- 클로저가 불편하다면, Babel Stage-3에 있는 `#` 키워드를 사용하세요.
