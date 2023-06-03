---
title: 제네릭을 활용한 컴포넌트 추상화
date: '2021-9-28'
tags: ['typescript', 'react']
draft: false
summary: 제네릭은 보통 추상화할 때 많이 사용한다. React Component를 개발하다가 제네릭을 이용해서 컴포넌트를 추상화할 수 있을 것 같다는 생각을 했다. 제네릭을 통해 컴포넌트 추상화하는 방법을 알아보자.
---

제네릭은 보통 추상화할 때 많이 사용한다. React Component를 개발하다가 제네릭을 이용해서 컴포넌트를 추상화할 수 있을 것 같다는 생각을 했다. 제네릭을 활용해서 컴포넌트 추상화하는 방법을 알아보자.

어떤 상황에서 사용할 수 있을까?

다음 상황을 생각해보자. API 응답을 받고 `List`로 보여주는 컴포넌트가 있다. API 응답에 공통적으로 `id`가 들어있다.

```json
{
  "users": [
    {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz"
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "username": "Antonette",
      "email": "Shanna@melissa.tv"
    }
    // ...
  ]
}
```

```json
{
  "todos": [
    {
      "userId": 1,
      "id": 1,
      "title": "delectus aut autem",
      "completed": false
    },
    {
      "userId": 1,
      "id": 2,
      "title": "quis ut nam facilis et officia qui",
      "completed": false
    }
    // ...
  ]
}
```

반복적인 게 눈에 들어오고, 이거 추상화할 수 있을 것 같은데 라는 생각을 할 것이다. 이제 내용을 한 번 보자. 직접 추상화를 한 번 해보자.

```tsx
type ListProps<TItem> = {
  items: TItem[]
  renderEmpty: React.ReactElement
  renderItem: (item: TItem) => React.ReactElement
}

const List = <TItem extends { id: number }>({
  items,
  renderEmpty,
  renderItem,
}: ListProps<TItem>): React.ReactElement => {
  if (items.length === 0) return renderEmpty

  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

먼저 `ListProps`를 보자. (참고로, 나는 `Props`를 먼저 선언하고 컴포넌트 개발을 시작한다.) `items`에 API 응답으로 받은 리스트들이 담겨올 것이다. `id`가 공통적으로 들어있으니 `TItem`이라고 이름을 지어줬다. 그리고 `renderItem`은 `TItem` 타입의 `item`을 가지고 `ReactElement`를 반환하는 값이다.

다음으로 `List` 컴포넌트를 보자. `<TItem extends { id: number }>`이라는 제네릭이 포함되어 있다. 어떤 의미일까?

> `TItem`은 최소한 `{ id: string }`이 들어있어야 한다.

이렇게 해서 제네릭을 이용한 컴포넌트를 만들어 봤다. 단순한 예제이지만 잘 활용하면 아주 유용할 것 같다.
