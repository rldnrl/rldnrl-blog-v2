---
title: 최신 문법의 JavaScript 트랜스파일링
date: '2021-11-20'
tags: ['javascript', 'class']
draft: false
summary: 최신 문법의 JavaScript가 어떻게 트랜스파일링 되는지 궁금했다.
---

최신 문법의 JavaScript가 어떻게 트랜스파일링 되는지 궁금했다.

## Class

### ES6

```js
class Person {
  constructor(name, age) {
  	this.name = name
    this.age = age
  }
  getName() {
  	return this.name
  }
  getAge() {
  	return this.age
  }
}
```

### ES5

```js
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Person = function () {
  function Person(name, age) {
    _classCallCheck(this, Person);

    this.name = name;
    this.age = age;
  }

  _createClass(Person, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "getAge",
    value: function getAge() {
      return this.age;
    }
  }]);

  return Person;
}();
```

## Generator
### ES6

```js
function *app() {
  yield "test"
}
```

### ES5

```js
"use strict";

var _marked = /*#__PURE__*/regeneratorRuntime.mark(app);

function app() {
  return regeneratorRuntime.wrap(function app$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return "test";

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
```

## Async-Await
### ES8

```js
async function getUser() {
	const response = await fetch()
  return response
}
```

### ES5

```js
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this, args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      } 
      _next(undefined);
    });
  };
}

function getUser() {
  return _getUser.apply(this, arguments);
}

function _getUser() {
  _getUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch();

          case 2:
            response = _context.sent;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getUser.apply(this, arguments);
}
```