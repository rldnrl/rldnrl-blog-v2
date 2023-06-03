---
title: Promise란?
date: '2021-11-15'
tags: ['javascript', 'promise']
draft: false
summary: 비동기 처리할 때 많이 사용하는 Promise에 대해서 알아보자.
---

> A promise is an object that may produce a single value some time in the future

Promise는 Promise가 생성될 때 반드시 알려지지 않은 값에 대한 프록시이다. 이를 통해 핸들러를 비동기 작업의 최종 성공 값 또는 실패 이유와 연결할 수 있다. 프로미스를 사용하면 비동기 메서드에서 마치 동기 메서드처럼 값을 반환할 수 있다. 다만 최종 결과를 반환하지는 않고, 대신 프로미스를 반환해서 미래의 어떤 시점에 결과를 제공한다.

Promise는 다음 중 하나의 상태를 가진다.

- 대기(pending): 이행하거나 거부되지 않은 초기 상태. 로딩 상태.
- 이행(fulfilled): 성공적으로 완료.
- 거부(rejected): 실패함.

대기 중인 프로미스는 값과 함께 이행할 수도 있고, 어떤 이유(오류)로 인해 거부될 수 있습니다. 이행이나 거부될 때, 프로미스에 연결한 처리기는 그 프로미스의 `then` 메서드에 의해 대기열에 오른다. 이미 이행했거나 거부된 프로미스에 연결한 처리기도 호출하므로, 비동기 연산과 처리기 연결 사이에 경합 조건은 없다.
