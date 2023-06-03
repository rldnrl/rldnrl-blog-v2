---
title: Node.js Deep Dive
date: '2022-02-20'
tags: ['Node', 'JavaScript']
draft: false
summary: Node.js에 대해서 깊게 들여다 봅시다.
---

프론트엔드 개발자로서 JavaScript에 대해서 공부를 해야겠다고 생각을 했습니다. 요즘 프론트엔드 개발자들도 Node.js 런타임에서 개발을 하고 있기 때문이죠. 무엇보다 JavaScript에 대해서 알고 싶은 마음이 컸습니다. 이 글은 [다음 글](https://www.freecodecamp.org/news/node-js-what-when-where-why-how-ab8424886e2/amp/)을 번역했습니다.

## I/O

Input/Output의 줄임말인 I/O는 주로 시스템의 디스크 및 네트워크와 프로그램의 상호 작용을 나타냅니다. I/O 작업의 예로는 디스크에서/디스크로 데이터 읽기/쓰기, HTTP 요청 만들기, 데이터베이스와 통신하기 등이 있습니다. 메모리(RAM) 액세스나 CPU 작업에 비해 매우 느립니다.

## 동기 vs 비동기

동기는 일반적으로 순서대로 실행되는 코드를 나타냅니다. 동기 프로그래밍에서 프로그램은 한 번에 한 줄씩 실행됩니다. 함수가 호출될 때마다 프로그램 실행은 해당 함수가 반환될 때까지 기다렸다가 다음 코드 줄로 계속 진행합니다.

비동기는 코드에 나타나는 순서대로 실행되지 않는 실행을 나타냅니다. 비동기 프로그래밍에서 프로그램은 작업이 완료될 때까지 기다리지 않고 다음 작업으로 이동할 수 있습니다.

다음 예에서는 동기화 작업으로 인해 경고가 순서대로 실행됩니다. 비동기 작업에서 `alert(2)`가 두 번째로 실행되는 것처럼 보이지만 그렇지 않습니다.

```js
// Synchronous: 1,2,3
alert(1)
alert(2)
alert(3)

// Asynchronous: 1,3,2
alert(1)
setTimeout(() => alert(2), 0)
alert(3)
```

비동기 작업은 종종 I/O와 관련이 있습니다. (`setTimeout`은 I/O가 아니지만 여전히 비동기인 것의 예입니다.) 일반적으로 계산과 관련된 모든 것은 동기화이고 Input/Output/Timing과 관련된 모든 것은 비동기입니다. I/O 작업이 비동기적으로 수행되는 이유는 매우 느리고 그렇지 않으면 추가 코드 실행을 차단하기 때문입니다.

## Blocking vs Non-Blocking

**Blocking**은 해당 작업이 완료될 때까지 추가 실행을 차단하는 작업을 말합니다.

**Non-Blocking**은 실행을 차단하지 않는 코드를 말합니다. 또는 Node.js 문서에 따르면 차단은 Node.js 프로세스에서 추가 JavaScript 실행이 JavaScript가 아닌 작업이 완료될 때까지 기다려야 하는 경우입니다.

Blocking 메서드는 동기식으로 실행되고 Non-Blocking 메서드는 비동기식으로 실행됩니다.

```js
// Blocking
const fs = require('fs')
const data = fs.readFileSync('/file.md') // blocks here until file is read
console.log(data)
moreWork() // will run after console.log

// Non-blocking
const fs = require('fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // will run before console.log
```

위의 첫 번째 예에서 `console.log`는 `moreWork()`보다 먼저 호출됩니다. 두 번째 예에서 `fs.readFile()`은 Non-Blocking므로 JavaScript 실행을 계속할 수 있고 `moreWork()`가 먼저 호출됩니다.

Node에서 Non-blocking은 주로 I/O 작업을 말하며, I/O와 같은 non-JavaScript 작업을 기다리지 않고 CPU를 많이 사용하여 성능이 떨어지는 JavaScript는 일반적으로 Blocking이라고 하지 않습니다.

Node.js 표준 라이브러리의 모든 I/O 메서드는 비동기 버전을 제공하며 이는 Non-Blocking이며 콜백 기능을 허용합니다. 일부 메서드에는 Sync로 끝나는 이름을 가진 Blocking도 있습니다.

Non-Blocking I/O 작업을 통해 단일 프로세스가 동시에 여러 요청을 처리할 수 있습니다. 프로세스가 차단되고 I/O 작업이 완료되기를 기다리는 대신 I/O 작업이 시스템에 위임되어 프로세스가 다음 코드를 실행할 수 있습니다. Non-Blocking I/O 작업은 작업이 완료될 때 호출되는 콜백 함수를 제공합니다.

## Callback

콜백은 다른 함수에 인수로 전달된 함수로, 외부 함수 내부에서 호출(다시 호출)되어 편리한 시간에 일종의 작업을 완료할 수 있습니다. 호출은 즉각적일 수도 있고(동기화 콜백) 나중에 발생할 수도 있습니다(비동기 콜백).

```jsx
// Sync callback
function greetings(callback) {
  callback()
}
greetings(() => {
  console.log('Hi')
})
moreWork() // will run after console.log

// Async callback
const fs = require('fs')
fs.readFile('/file.md', function callback(err, data) {
  // fs.readFile is an async method provided by Node
  if (err) throw err
  console.log(data)
})
moreWork() // will run before console.log
```

첫 번째 예에서 콜백 함수는 외부 `Greetings` 함수 내에서 즉시 호출되고 `moreWork()`가 진행되기 전에 콘솔에 기록됩니다.

두 번째 예에서 `fs.readFile`(Node에서 제공하는 비동기 메서드)은 파일을 읽고 완료되면 오류 또는 파일 내용과 함께 콜백 함수를 호출합니다. 그 동안 프로그램은 코드 실행을 계속할 수 있습니다.

이벤트가 발생하거나 작업이 완료되면 비동기 콜백이 호출될 수 있습니다. 그 동안 다른 코드가 실행되도록 하여 차단을 방지합니다.

절차적으로 위에서 아래로 코드를 읽는 대신 비동기 프로그램은 http 요청이나 파일 시스템 읽기와 같은 이전 기능이 발생하는 순서와 속도에 따라 다른 시간에 다른 기능을 실행할 수 있습니다. 일부 비동기 작업이 완료될 때를 알 수 없는 경우에 사용됩니다.

콜백이 여러 수준 깊이의 다른 콜백 내에 중첩되어 코드를 이해하고 유지 관리하고 디버그하기 어렵게 만드는 상황인 "콜백 지옥"을 피해야 합니다.

## Event and event-driven-programming

이벤트는 클릭, 완료된 파일 다운로드 또는 하드웨어 또는 소프트웨어 오류와 같이 사용자 또는 시스템에 의해 생성된 작업입니다.

Event-Driven-Programming은 프로그램의 흐름이 이벤트에 의해 결정되는 프로그래밍 패러다임입니다. 이벤트 기반 프로그램은 이벤트에 대한 응답으로 작업을 수행합니다. 이벤트가 발생하면 콜백 함수가 트리거됩니다.

이제 노드를 이해하고 이 모든 것이 노드와 어떻게 관련되는지 살펴보겠습니다.

## **Node.js: 그것이 무엇이며 왜 생성되었으며 어떻게 작동합니까?**

간단히 말해서 Node.js는 네트워크 및 파일 시스템과 같은 I/O 소스와 통신할 수 있는 서버 측 JavaScript 프로그램을 실행하는 플랫폼입니다.

Ryan Dahl은 2009년 Node를 만들 때 I/O가 잘못 처리되어 동기식 프로그래밍으로 인해 전체 프로세스를 차단한다고 주장했습니다.

전통적인 웹 서비스 기술은 각 요청에 대해 하나의 스레드를 의미하는 스레드 모델을 사용합니다. I/O 작업에서 요청이 완료될 때까지 대부분의 시간을 소비하기 때문에 intensive I/O 시나리오에는 이러한 스레드에 연결된 많은 양의 미사용 리소스(예: 메모리)가 수반됩니다. 따라서 서버에 대한 "요청당 하나의 스레드(one thread per request)" 모델은 잘 확장되지 않습니다.

Dahl은 소프트웨어가 멀티태스킹을 할 수 있어야 한다고 주장하고 I/O 결과가 돌아올 때까지 기다리는 시간을 없앨 것을 제안했습니다. 그는 스레드 모델 대신 여러 동시 연결을 처리하는 올바른 방법은 단일 스레드, 이벤트 루프 및 Non-Blocking I/O를 갖는 것이라고 말했습니다. 예를 들어, 데이터베이스에 대한 쿼리를 작성할 때 응답을 기다리는 대신 콜백을 제공하여 실행이 해당 명령문을 통해 실행되고 다른 작업을 계속할 수 있도록 합니다. 결과가 돌아오면 콜백을 실행할 수 있습니다.

이벤트 루프는 JavaScript가 단일 스레드라는 사실에도 불구하고 Node.js가 Non-Blocking I/O 작업을 수행할 수 있게 해주는 것입니다. JavaScript 코드와 동일한 스레드에서 실행되는 루프는 코드에서 작업을 가져와 실행합니다. 작업이 비동기식이거나 I/O 작업인 경우 이벤트 루프는 서버에 대한 새 연결의 경우와 같이 시스템 커널 또는 파일 시스템 관련 작업과 같은 스레드 풀로 작업을 오프로드합니다. 그런 다음 루프는 다음 작업을 잡고 실행합니다.

대부분의 최신 커널은 다중 스레드이므로 백그라운드에서 실행되는 여러 작업을 처리할 수 있습니다. 이러한 작업 중 하나가 완료되면(이것은 이벤트임) 커널은 적절한 콜백(작업 완료에 의존하는 콜백)이 결국 실행되도록 폴 큐에 추가될 수 있도록 Node.js에 알립니다.

Node는 완료되지 않은 비동기 작업을 추적하고 이벤트 루프는 모든 작업이 완료될 때까지 완료되었는지 확인하기 위해 계속 반복됩니다.

단일 스레드 이벤트 루프를 수용하기 위해 Node.js는 libuv 라이브러리를 사용하며, 이 라이브러리는 일부 Non-Blocking 비동기 I/O 작업의 실행을 병렬로 처리하는 고정 크기 스레드 풀을 사용합니다. 기본 스레드 호출 함수는 스레드 풀의 스레드가 끌어오고 실행하는 Shared Task Queue에 작업을 게시합니다.

네트워킹과 같은 본질적으로 Non-Blocking 시스템 기능은 커널 측 Non-Blocking 소켓으로 변환되는 반면 파일 I/O와 같은 본질적으로 Blocking 시스템 기능은 자체 스레드에서 Blocking 방식으로 실행됩니다. 스레드 풀의 스레드가 작업을 완료하면 메인 스레드에 이를 알리고 메인 스레드는 깨어나서 등록된 콜백을 실행합니다.
