---
title: 제너레이터
date: '2021-9-27'
tags: ['javascript', 'generator']
draft: false
summary: 나는 처음 제너레이터에 대해 "제너레이터? 그게 그렇게 중요한가?"라는 생각을 했다. 프론트엔드 개발에서는 비동기 처리가 최대의 난제이다. 제너레이터가 비동기 처리에 도움을 줄 수 있다는 얘기를 들었다. 그래서 정리해봤다.
---

나는 처음 제너레이터에 대해 "제너레이터? 그게 그렇게 중요한가?"라는 생각을 했다. 프론트엔드 개발에서는 비동기 처리가 최대의 난제이다. 제너레이터가 비동기 처리에 도움을 줄 수 있다는 얘기를 들었다. 그래서 정리해봤다.

## 제너레이터 설명1([출처. Toast UI](https://ui.toast.com/weekly-pick/ko_20151021))

Generator는 Iterable이면서 Iterator인 객체의 특별한 종류이다. 이 객체는 일시정지와 재시작 기능을 여러 반환 포인트들을 통해 사용할 수 있다. 이러한 반환 포인트들은 `yield` 키워드를 통해 구현할 수 있으며, 오직 Generator 함수에서만 사용할 수 있다. `next` 호출시마다 다음 `yield`의 expression이 반환된다.
`yield value`를 사용하면 한가지 값을 반환할 수 있고, `yield* iterable`을 사용하면 해당되는 Iterable의 값들을 순차적으로 반환시킬 수 있다.

Generator의 반복이 끝나는 시점은 3가지 경우인데, Generator 함수에서 `return` 사용, 에러 발생 그리고 마지막으로 함수의 끝부분까지 모두 수행된 이후, 이렇게 3가지 경우이다. 그리고 이때 `done` 프로퍼티가 `true`가 될 것이다.

이러한 Generator 함수는 Generator 객체를 반환하며, `function*` 키워드로 정의할 수 있다. 또는 클래스에서 메서드 이름 앞에 `*`을 붙여 정의할 수도 있다.

<br />

## 제너레이터 설명2([출처. vallista](https://vallista.kr/2019/07/12/%EC%A0%9C%EB%84%88%EB%A0%88%EC%9D%B4%ED%84%B0-Generator))

컴퓨터 과학에서 Generator는 루프의 반복 동작을 제어하는데 사용될 수 있는 루프이다. 여기서 알 수 있는 사실은, 모든 Generator는 Iterator(반복자)라는 것이다. Generator는 매개변수를 가지고 있고, 호출 할 수 있으며, 값을 생성한다는 점에서 배열을 반환하는 행동과 비슷한데, 모든 값을 포함하는 배열을 만들어서 반환하는게 아니라 한번에 한 작업을 처리하고 하나씩 산출한다. 그래서 전체 배열을 반환하는 로직보다 메모리가 적게 필요하며 첫 실행시에 갯수 제한 없이 즉시 작업을 처리하도록 명령할 수 있다. 쉽게 말해서, Generator는 기능이 붙은 Iterator(반복자)라고 볼 수 있다.

Generator는 **Coroutine**이나, **First-class continuations**처럼 흐름을 제어하는 구조적인 측면에서 구현될 수 있다.

> Coroutine(코루틴)은 실행 중지 및 재시작이 가능하도록 하여 non-preemptive multitasking(선제적 다중작업) 서브루틴을 일반화하는 컴퓨터 프로그램 구성 요소이다. 말이 좀 어려운데, 조금 더 펼쳐서 이야기를 해보자. 어떤 프로세스가 CPU를 할당 받으면 그 프로세스가 종료되거나 IRequest가 발생한다. 그래서 자발적으로 대기 상태로 들어갈 때까지 계속 실행이 된다. 즉, 한 작업이 끝나고 다음 작업을 한다는 이야기이다. Coroutine은 프로그래밍 언어마다 지원하는 경우가 많다. 코루틴은 해당 로직이 동작하면서 정지하거나 재개하는 등의 행위를 할 수 있다.

<br />

> First-class continuations(1등급 연속체)는 명령의 실행 순서를 완전히 제어할 수 있는 구문이다. 지금 실행시킨 함수 호출이 끝나고 "발생시킨 함수" 혹은 "발생시키기 이전 함수"로 점프하는 데 사용된다. 이는, 프로그램의 실행 상태를 유지하는 것으로 생각할 수 있다. 설명이 어려운데, 보통 "Continuation Sandwich"(연속적인 샌드위치)로 설명한다. 주방 안의 냉장고 앞에서 샌드위치 재료를 꺼낸다고 생각해보자. 냉장고 안에서 칠면조나 빵과 같은 재료를 연속적으로 꺼내 샌드위치를 만들게 된다. 만든 샌드위치를 식탁 위에 놓고 보니, 배가 차지 않을 것 같아서 샌드위치에 패티를 추가하기 위해 냉장고 앞으로 향했다. 냉장고 안에는 재료가 모두 소진되어 없었고 만든 샌드위치를 먹기위해 식탁으로 향했다.

연속적인 샌드위치 예제에서 알 수 있는 것은 샌드위치는 프로그램 데이터이며, 샌드위치 만들기 루틴을 호출한 후 돌아오는게 아닌, 현재 지속되는 샌드위치 만들기 루틴을 호출하여 샌드위치를 만든 다음, 실행이 중단된 곳에서 다시 진행된다. 대표적인 예는, `async-await`로 들 수 있다.

<br />

```tsx
function* gen() {
  yield 1
  if (false) yield 2
  yield 3
}

let iter = gen()
log(iter[Symbol.iterator]() == iter)
log(iter.next())
log(iter.next())
log(iter.next())
log(iter.next())

for (const element of gen()) console.log(element)
```

<br />

```tsx
function* infinity(i = 0) {
  while (true) yield i++
}

function* limit(l, iter) {
  for (const a of iter) {
    yield a
    if (a === l) return
  }
}

function* odds(l) {
  for (const a of limit(l, infinity(1))) {
    if (a % 2) yield a
  }
}

let iter = odds(10)
log(iter.next())
log(iter.next())
log(iter.next())
log(iter.next())
log(iter.next())
log(iter.next())
log(iter.next())
```

<br />

## 제너레이터를 이용한 피보나치 수열

```tsx
function* fibonacci() {
  let prev = 0,
    curr = 1
  yield prev
  yield curr
  while (true) {
    let temp = prev
    prev = curr
    curr = temp + curr

    yield curr
  }
}

for (const n of fibonacci()) {
  if (n > 100) break
  console.log(n)
}
```

<br />

## 제너레이터를 포함한 객체

```tsx
let fib = {
  *[Symbol.iterator]() {
    let prev = 0,
      curr = 1 // [prev, curr] = [0, 1];
    yield prev
    yield curr
    while (true) {
      let temp = prev
      prev = curr
      curr = temp + curr
      // [prev, curr] = [curr, prev + curr];

      yield curr
    }
  },
}

for (const n of fib) {
  if (n > 100) break
  console.log(n)
}
```

<br />

## Generator 메서드

- `next(value)`
  이 메서드는 다음 값을 얻는 역할을 하며, Iterator의 `next` 메서드와 유사하지만, optional argument를 받는다는 점이 다르다. (첫번째 호출에서는 받지 않고 무시한다.) 이 매개변수는 바로 이전의 `yield [expression]`의 반환값으로 사용된다. (아래 예시를 참고.)

- `return(value)`
  이 메서드는 매개변수로 온 값을 `value`로써 반환하고, Generator를 종료시킨다.

```tsx
{value: value, done: true}
```

- `throw(exception)`
  이 메서드는 인자로 받은 에러 발생시키고, Generator를 종료시킨다. Generator 함수 내부의 `catch` 구문을 통해 처리할 수도 있다. 또한 내부에서 `catch` 구문으로 처리한 경우 Generator는 종료되지 않는다.
