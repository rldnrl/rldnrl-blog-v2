---
title: Naming Cheatsheet
date: '2022-06-14'
tags: ["naming"]
draft: false
summary: Naming Cheatsheet를 번역한 글입니다. 네이밍 하는 데 고통이 줄어들길...
---

이 글은 [다음](https://github.com/kettanaito/naming-cheatsheet)을 번역한 글입니다.

이름을 짓는 것은 어려운 일입니다. 이 Sheet는 이름 짓는 것을 쉽게 해줍니다.

이 제안은 어떤 프로그래밍 언어든 적용할 수 있으며, 저는 자바스크립트를 활용해서 설명할 것입니다.

## English Language
변수나 함수를 네이밍할 때 영어 이름을 사용하십시오.

```js
/* Bad */
const 이름 = 'Gustavo'
const 친구들 = ['Kate', 'John']

/* Good */
const firstName = 'Gustavo'
const friends = ['Kate', 'John']
```

> 좋든 싫든 영어는 프로그래밍에서 지배적인 언어입니다: 모든 프로그래밍 언어의 문법, 엄청 많은 문서와 교육 자료는 영어로 쓰여있습니다. 코드를 영어로 작성하면 응집력이 향상됩니다.

## Naming Convention
하나의 네이밍 규칙을 선택하고 따르십시오. 일관성을 유지하는 한 `camelCase` `PascalCase`, `snake_case` 또는 기타 모든 것이 될 수 있습니다. 많은 프로그래밍 언어는 네이밍과 관련한 고유한 전통이 있습니다. 당신이 사용하고 있는 언어에 대한 문서를 확인해보세요. 혹은 유명한 Github 레포지토리를 연구해보세요.

```js
/* Bad */
const page_count = 5
const shouldUpdate = true

/* Good */
const pageCount = 5
const shouldUpdate = true

/* Good as well */
const page_count = 5
const should_update = true
```

## S-I-D

이름은 짧고(short) 직관적(intuitive)이며 구체적(descriptive)이어야 합니다.

- **Short**: 이름은 입력하는 데 오래 걸리지 않으므로 기억해야 합니다.
- **Intuitive**: 이름은 가능한 한 일반적인 말하는 것과 가깝게 자연스럽게 읽어야 합니다.
- **Descriptive**: 이름은 가장 효율적인 방식으로 does/possesses하는 것을 반영해야 합니다.

```js
/* Bad */
const a = 5 // "a"는 어떤 것이든 될 수 있습니다.
const isPaginatable = a > 10 // "Paginatable" 극단적으로 자연스럽지 않습니다.
const shouldPaginatize = a > 10 // 만든 동사가 웃기네요!

/* Good */
const postCount = 5
const hasPagination = postCount > 10
const shouldPaginate = postCount > 10 // alternatively
```

## 축약을 피하세요.
축약은 사용하지 말아야합니다. 축약은 코드의 가독성을 떨어뜨리는 것 외에는 아무 것도 하지 않습니다. 짧고 구체적인 이름을 찾는 것은 어려울 수 있지만, 축약형이 구체적인 이름을 짓지 않는 것에 대한 이유는 아닙니다.

```js
/* Bad */
const onItmClk = () => {}

/* Good */
const onItemClick = () => {}
```

## 문맥상 중복을 피하세요.
이름은 정의된 컨텍스트와 중복되어서는 안 됩니다. 가독성이 떨어지지 않는다면, 항상 이름에서 컨텍스트를 제거하십시오.

```js
class MenuItem {
  /* 메서드 이름이 현재 컨텍스트와 중복되었습니다. ("MenuItem") */
  handleMenuItemClick = (event) => { ... }

  /* `MenuItem.handleClick()`으로 잘 읽힙니다. */
  handleClick = (event) => { ... }
}
```

## 예상 결과를 반영하세요.
이름은 예상 결과를 반영해야 합니다.

```js
/* Bad */
const isEnabled = itemCount > 3
return <Button disabled={!isEnabled} />

/* Good */
const isDisabled = itemCount <= 3
return <Button disabled={isDisabled} />
```

# Naming functions
## A/HC/LC Pattern
함수 이름을 지정할 때 따라야 할 유용한 패턴이 있습니다.

```
prefix? + action (A) + high context (HC) + low context? (LC)
```

이 패턴이 아래 표에서 어떻게 적용될 수 있는지 살펴보십시오.

| Name                   | Prefix   | Action (A) | High context (HC) | Low context (LC) |
| ---------------------- | -------- | ---------- | ----------------- | ---------------- |
| `getUser`              |          | `get`      | `User`            |                  |
| `getUserMessages`      |          | `get`      | `User`            | `Messages`       |
| `handleClickOutside`   |          | `handle`   | `Click`           | `Outside`        |
| `shouldDisplayMessage` | `should` | `Display`  | `Message`         |                  |

> Note: 컨텍스트의 순서는 변수의 의미에 영향을 줍니다. 예를 들어, `shouldUpdateComponent`는 구성 요소를 업데이트하려고 함을 의미하는 반면 `shouldComponentUpdate`는 구성 요소가 자체적으로 업데이트되며 업데이트해야 하는 시기를 제어할 수 있음을 알려줍니다.

## Action
함수 이름의 동사 부분입니다. 함수가 하는 일을 설명하는 가장 중요한 부분입니다.

### `get`

데이터에 즉시 액세스합니다(즉, 단축 `getter` 또는 내부 데이터).

```js
function getFruitCount() {
  return this.fruits.length
}
```

### `set`

값 `A`를 값 `B`로 사용하여 선언적 방식으로 변수를 설정합니다.

```js
let fruits = 0

function setFruits(nextFruits) {
  fruits = nextFruits
}

setFruits(5)
console.log(fruits) // 5
```

### `reset`

변수를 초기 값 또는 상태(state)로 다시 설정합니다.

```js
const initialFruits = 5
let fruits = initialFruits
setFruits(10)
console.log(fruits) // 10

function resetFruits() {
  fruits = initialFruits
}

resetFruits()
console.log(fruits) // 5
```

### `fetch`

불확실한 시간이 소요되는 일부 데이터 요청입니다.(비동기 요청)

```js
function fetchPosts(postCount) {
  return fetch('https://api.dev/posts', {...})
}
```

### `remove`
*어딘가*에서 *무언가*를 제거합니다.(Removes *something* from *somewhere*.)

예를 들어, 검색 페이지에 선택한 필터 모음이 있는 경우 모음에서 필터 중 하나를 제거하는 것은 `deleteFilter`가 아니라 `removeFilter`입니다(이는 자연스럽게 영어로도 말할 수 있는 방법입니다).

```js
function removeFilter(filterName, filters) {
  return filters.filter((name) => name !== filterName)
}

const selectedFilters = ['price', 'availability', 'size']
removeFilter('price', selectedFilters)
```

### `delete`

존재의 영역에서 무언가를 완전히 삭제합니다.(Completely erases something from the realms of existence.)

당신이 콘텐츠 편집자이고 없애고 싶은 악명 높은 게시물이 있다고 상상해보십시오. "게시물 삭제" 버튼을 클릭했을 때, CMS가 `removePost`가 아닌 `deletePost` 작업을 수행했습니다.

```js
function deletePost(id) {
  return database.find({ id }).delete()
}
```

### `compose`

기존 데이터에서 새 데이터를 생성합니다. 주로 문자열, 객체 또는 함수에 적용할 수 있습니다.

```js
function composePageUrl(pageName, pageId) {
  return (pageName.toLowerCase() + '-' + pageId)
}
```

### `handle`

어떤 작업을 처리합니다. 콜백 메소드의 이름을 지정할 때 자주 사용됩니다.

```js
function handleLinkClick() {
  console.log('Clicked a link!')
}

link.addEventListener('click', handleLinkClick)
```

## Context

함수가 동작하는 도메인입니다. 함수는 종종 무언가에 대한 작업입니다. 작동 가능한 도메인이 무엇인지 또는 최소한 예상되는 데이터 타입을 명시하는 것이 중요합니다.

```js
/* A pure function operating with primitives */
function filter(list, predicate) {
  return list.filter(predicate)
}

/* Function operating exactly on posts */
function getRecentPosts(posts) {
  return filter(posts, (post) => post.date === Date.now())
}
```

> 일부 언어별 가정(assumptions)에서는 컨텍스트를 생략할 수 있습니다. 예를 들어 JavaScript에서는 `filter`가 `Array`에서 작동하는 것이 일반적입니다. 명시적 `filterArray`를 추가할 필요가 없습니다.

## Prefixes
prefix는 변수의 의미를 향상시킵니다. 함수 이름에는 거의 사용되지 않습니다.

### `is`
현재 컨텍스트(일반적으로 `boolean`)의 특성 또는 상태를 설명합니다.

```js
const color = 'blue'
const isBlue = color === 'blue' // characteristic
const isPresent = true // state

if (isBlue && isPresent) {
  console.log('Blue is present!')
}
```

### `has`

현재 컨텍스트가 특정 값 또는 상태(보통 `boolean`)를 소유하는지 여부를 설명합니다.

```js
/* Bad */
const isProductsExist = productsCount > 0
const areProductsPresent = productsCount > 0

/* Good */
const hasProducts = productsCount > 0
```

### `should`

특정 액션과 결합된 긍정적인 조건문(일반적으로 `boolean`)을 반영합니다.

```js
function shouldUpdateUrl(url, expectedUrl) {
  return url !== expectedUrl
}
```

### `min`/`max`

최소값 또는 최대값을 나타냅니다. 경계 또는 한계를 설명할 때 사용됩니다.

```js
/**
 * Renders a random amount of posts within
 * the given min/max boundaries.
 */
function renderPosts(posts, minPosts, maxPosts) {
  return posts.slice(0, randomBetween(minPosts, maxPosts))
}
```

### `prev`/`next`

현재 컨텍스트에서 변수의 이전 또는 다음 상태를 나타냅니다. 상태 전환을 설명할 때 사용됩니다.

```js
function fetchPosts() {
  const prevPosts = this.state.posts

  const fetchedPosts = fetch('...')
  const nextPosts = concat(prevPosts, fetchedPosts)

  this.setState({ posts: nextPosts })
}
```

### Singular and Plurals

prefix와 마찬가지로 변수 이름은 단일 값 또는 여러 값을 보유하는지 여부에 따라 **단수** 또는 **복수**로 만들 수 있습니다.

```js
/* Bad */
const friends = 'Bob'
const friend = ['Bob', 'Tony', 'Tanya']

/* Good */
const friend = 'Bob'
const friends = ['Bob', 'Tony', 'Tanya']
```