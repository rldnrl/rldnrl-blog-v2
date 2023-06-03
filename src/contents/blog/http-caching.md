---
title: HTTP 캐시
date: '2021-9-27'
tags: ['http']
draft: false
summary: HTTP 캐시에 대해서 알아보자.
---

## 캐시와 조건부 요청

### 시간 초과

- 캐시에서 유효 시간이 초과해서 서버에 다시 요청하면 다음 두 가지 상황 발생
  - 서버에서 기존 데이터를 변경함 - 클라이언트의 캐시된 데이터와 서버의 데이터가 일치하지 않는 경우
  - 서버에서 기존 데이터를 변경하지 않음 - 클라이언트의 캐시된 데이터와 서버의 데이터가 일치하는 경우

<br />

### 상황1

- 캐시 만료 후에도 서버에서 데이터를 변경하지 않음
- 브라우저에 저장되어 있던 캐시를 재사용할 수 있다.
- 단, 클라이언트의 데이터와 서버의 데이터가 같다는 사실을 확인할 수 있는 방법이 필요
- 캐시 만료 시간: 60초
  - 서버에서 `last-modified`에 날짜를 붙여서 전송한다.
  - 클라이언트는 `last-modified` 날짜 정보까지 캐시에 저장한다.
  - 만료가 되었을 때(60초가 지났을 때), 클라이언트는 `if-modified-since`에 캐시에 저장되어 있던 날짜를 붙여서 서버에 전송한다.
  - 서버가 날짜 값이 같은 지 확인한다.
    - 같다면, 서버가 304 Not Modified + HTTP Header에 `last-modified`를 동일하게 보낸다.(Body X)
    - 클라이언트는 응답을 받고, "재사용할 수 있네!" 하고 브라우저 캐시에서 재사용한다.
    - 같지 않다면, 200 OK와 데이터를 전송한다.

<br />

### `last-modified`와 `if-modified-since` 단점

- 1초 미만 단위로 캐시 조정 불가능
- 날짜 기반의 로직 사용
- 데이터를 수정해서 날짜가 다르지만, 같은 데이터를 수정해서 데이터 결과가 같은 경우
- 서버에서 별도의 캐시 로직을 관리하고 싶은 경우
  - 예. 스페이스나 주석처럼 크게 영향이 없는 변경에서 캐시를 유지하고 싶은 경우

<br />

### ETag(Entity Tag)

- 캐시용 데이터에 임의의 고유한 버전 이름을 달아둔다.
- 데이터가 변경되면 이 이름을 바꿔서 변경한다.
- 캐시 제어 로직을 서버에서 완전히 관리
- 캐시 만료 시간: 60초
  - 서버에서 `ETag`에 값을 붙여서 전송한다.
  - 클라이언트는 `ETag` 정보를 브라우저 캐시에 저장한다.
  - 만료가 되었을 때(60초가 지났을 때), 클라이언트는 `if-none-matched`에 캐시에 저장되어 있던 `ETag` 정보를 붙여서 보낸다.
  - 서버가 ETag의 값이 같은 지 확인한다.
    - 같다면, 서버가 304 Not Modified + HTTP Header에 `ETag`를 동일하게 보낸다.(Body X)
    - 클라이언트는 응답을 받고, "재사용할 수 있네!" 하고 브라우저 캐시에서 재사용한다.
    - 같지 않다면, 200 OK와 데이터를 전송한다.

<br />

### Cache-Control

- `Cache-Control: max-age`: 캐시 유효 시간, 초 단위
- `Cache-Control: no-cache`: 데이터는 캐시해도 되지만, 항상 origin 서버에 검증하고 사용
- `Cache-Control: no-store`: 데이터에 민감한 정보가 있으니 저장하면 안 됨(메모리에서 사용하고 최대한 빨리 삭제)

\*origin 서버: 원래 자원이 있는 서버

<br />

### 검증 헤더

- `ETag`
- `last-modified`

### 조건부 요청 헤더

- `if-match`, `if-none-matched`: `ETag`에서 사용
- `if-modified-since`, `if-unmodified-since`: `last-modified`에서 사용

<br />

### 프록시 캐시

- `Cache-Control: public`: 응답이 `public` 캐시에 저장되어도 된다.
- `Cache-Control: private`: 응답이 해당 사용자만을 위한 것이다. `private` 캐시에 저장되어야 한다.(기본값)
- `Cache-Control: s-maxage`: 프록시 캐시에만 적용되는 max-age
- `Cache-Control: age`: origin 서버에서 응답 후 프록시 캐시 내에 머문 시간(초)

<br />

## 캐시 무효화

### Cache-Control

- `Cache-Control: no-cache`: 데이터는 캐시해도 되지만, 항상 origin 서버에 검증하고 사용
- `Cache-Control: no-store`: 데이터에 민감한 정보가 있으니 저장하면 안 됨(메모리에서 사용하고 최대한 빨리 삭제)
- `Cache-Control: must-revalidate`
  - 캐시 만료 후 최소 조회시 origin 서버에 검증을 해야한다.
  - origin 서버 접근 실패시 반드시 오류가 발생해야한다. - 504(GateWay Timeout)
  - `must-revalidate`는 캐시 유효 시간이라면 캐시를 사용한다.
