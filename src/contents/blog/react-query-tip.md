---
title: React-Query에서 알아야할 것
date: '2021-9-29'
tags: ['react', 'react-query']
draft: false
summary: 내가 React Query를 비동기 상태 관리 라이브러리로 괜찮다고 생각하고, 내가 맡았던 프로젝트에 도입을 했다. 한 두번 써본 경험이 있었는데 용어 정리가 제대로 되지 않았다. 그래서 이번에 정리를 해봤다.
---

내가 React Query를 비동기 상태 관리 라이브러리로 괜찮다고 생각하고, 내가 맡았던 프로젝트에 도입을 했다. 한 두번 써본 경험이 있었는데 용어 정리가 제대로 되지 않았다. 그래서 이번에 정리를 해봤다. [Practical React Query](https://tkdodo.eu/blog/practical-react-query)의 일부 내용을 번역했다.

## 기본값 설명

나는 React Query [Defaults](https://react-query.tanstack.com/guides/important-defaults)가 매우 잘 선택 되었다고 생각 하지만, 특히 처음에는 때때로 당신을 당황하게 할 수 있다.

가장 먼저: React Query는 기본 `staleTime`이 `0`인 경우에도 다시 렌더링할 때마다 `queryFn`을 호출 하지 않는다. 앱은 언제든지 다양한 이유로 다시 렌더링될 수 있으므로 매번 가져오는 것은 미친 짓이다!

> 항상 재렌더링을 위한 코딩을 하세요. 나는 그것을 렌더링 탄력성이라고 부르고 싶습니다.<br />
> — 태너 린슬리

예상하지 못한 refetch가 표시되면 방금 창에 초점을 맞추고 React Query가 프로덕션을 위한 훌륭한 기능인 `refetchOnWindowFocus`를 수행하고 있기 때문일 수 있다. 사용자가 다른 브라우저 탭으로 이동했다가 다시 돌아오는 경우 앱에 대한 백그라운드 다시 가져오기가 자동으로 트리거되고, 그 동안 서버에서 변경 사항이 있으면 화면의 데이터가 업데이트된다. 이 모든 것은 로딩 스피너가 표시되지 않고 발생하며 데이터가 현재 캐시에 있는 것과 동일한 경우 구성 요소가 다시 렌더링되지 않는다.

개발 중에는 특히 브라우저 DevTools와 앱 사이에 초점을 맞추면 가져오기가 발생하기 때문에 이 작업이 더 자주 트리거될 수 있으므로 주의해야 한다.

두 번째로, `cacheTime`과 `staleTime` 사이에 약간의 혼동이 있는 것 같으 므로 이를 정리하려고 합니다.

- StaleTime: 쿼리가 최신 상태에서 오래된 상태로 전환될 때까지의 기간이다. 쿼리가 최신 상태인 한 데이터는 항상 캐시에서만 읽힌다. 네트워크 요청은 발생하지 않는다! 쿼리가 오래된 경우(기본값: 즉시) 캐시에서 데이터를 계속 가져오지만 [특정 조건](https://react-query.tanstack.com/guides/caching)에서 백그라운드 다시 가져오기가 발생할 수 있다.
- CacheTime: 비활성 쿼리가 캐시에서 제거될 때까지의 기간이다. 기본값은 5분이다. 등록된 관찰자가 없는 즉시 쿼리가 비활성 상태로 전환되므로 해당 쿼리를 사용하는 모든 구성 요소가 마운트 해제됩니다.

## queryKey를 종속성 배열처럼 취급

여기에서는 `useEffect` 훅의 종속성 배열을 참조 하고 있다.

이 둘은 왜 비슷할까?

React Query는 `queryKey`가 변경될 때마다 다시 가져오기를 트리거하기 때문이다. 따라서 `queryFn`에 변수 매개변수를 전달할 때 거의 항상 해당 값이 변경될 때 데이터를 가져오기를 원한다. 수동으로 다시 가져오기를 트리거하기 위해 복잡한 효과를 조정하는 대신 `queryKey`를 사용할 수 있다.

```tsx
type State = 'all' | 'open' | 'done'
type Todo = {
  id: number
  state: State
}
type Todos = ReadonlyArray<Todo>

const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await axios.get(`todos/${state}`)
  return response.data
}

export const useTodosQuery = (state: State) => useQuery(['todos', state], () => fetchTodos(state))
```

여기에서 우리의 UI가 필터 옵션과 함께 할 일 목록을 표시한다고 상상해보자. 해당 필터링을 저장할 로컬 상태가 있고 사용자가 선택을 변경하는 즉시 해당 로컬 상태를 업데이트하면 `queryKey`가 변경되기 때문에 React Query가 자동으로 다시 가져오기를 트리거한다. 따라서 우리는 사용자의 필터 선택을 `queryFn`와 동기화 하도록 유지하고 있다. 이는 종속성 배열이 `useEffect`에 대해 나타내는 것과 매우 유사하다. 나는 `queryKey`의 일부 가 아닌 `queryFn`에도 변수를 전달한 적이 없다고 생각한다.

## 새 캐시 항목

`queryKey`가 캐시의 키로 사용되기 때문에 `all`에서 `done`으로 전환하면 새 캐시 항목이 표시되며, 이는 처음으로 전환한다. 이것은 확실히 이상적이지 않으므로 이러한 경우에 `keepPreviousData` 옵션을 사용하거나 가능하면 새로 생성된 캐시 항목을 `initialData`로 미리 채울 수 있다. 위의 예는 할 일에 대해 클라이언트 측 사전 필터링을 수행할 수 있기 때문에 완벽하다.

```tsx
type State = 'all' | 'open' | 'done'
type Todo = {
  id: number
  state: State
}
type Todos = ReadonlyArray<Todo>

const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await axios.get(`todos/${state}`)
  return response.data
}

export const useTodosQuery = (state: State) =>
  useQuery(['todos', state], () => fetchTodos(state), {
    initialData: () => {
      const allTodos = queryCache.getQuery<Todos>(['todos', 'all'])
      const filteredData = allTodos?.filter((todo) => todo.state === state) ?? []

      return filteredData.length > 0 ? filteredData : undefined
    },
  })
```

이제 사용자가 상태를 전환할 때마다 아직 데이터가 없으면 '모든 할일' 캐시의 데이터로 미리 채우려고 한다. 사용자에게 '완료된' 할 일을 즉시 표시할 수 있으며 백그라운드 가져오기가 완료되면 업데이트된 목록이 계속 표시된다. v3 이전에는 실제로 백그라운드 가져오기를 트리거하기 위해 `initialStale` 속성도 설정해야 한다.

## 서버와 클라이언트 상태를 별도로 유지

`useQuery`에서 데이터를 가져오는 경우 해당 데이터를 로컬 상태에 두지 말아라. 주된 이유는 "복사" 상태가 업데이트되지 않기 때문에 React Query가 수행하는 모든 백그라운드 업데이트를 암시적으로 선택 해제하기 때문이다.

예를 들어, Form에 대한 일부 기본값을 가져오고 데이터가 있으면 Form을 렌더링하려는 경우에 좋다. 백그라운드 업데이트는 새로운 것을 생성할 가능성이 거의 없으며 양식이 이미 초기화된 경우에도 마찬가지다. 따라서 의도적으로 그렇게 하는 경우 `staleTime`을 설정하여 불필요한 백그라운드 다시 가져오기 를 실행 하지 않도록 해라.

```tsx
const App = () => {
  const { data } = useQuery('key', queryFn, { staleTime: Infinity })

  return data ? <MyForm initialData={data} /> : null
}

const MyForm = ({ initialData} ) => {
  const [data, setData] = React.useState(initialData)
  ...
}
```

## 활성화된 옵션은 매우 강력하다

당신은 `useQuery`의 훅의 동작을 커스텀 할 수 있는 많은 옵션을 가지고 있으며, 사용 가능 옵션은 매우 강력하다. 다음은 이 옵션 덕분에 달성할 수 있었던 짧은 목록이다.

- [종속 쿼리](https://react-query.tanstack.com/guides/queries#dependent-queries): 하나의 쿼리에서 데이터를 가져오고 첫 번째 쿼리에서 데이터를 성공적으로 얻은 후에만 두 번째 쿼리를 실행한다.
- 쿼리 켜기 및 끄기 `refetchInterval`: 덕분에 정기적으로 데이터를 폴링하는 쿼리가 하나 있지만 모달이 열려 있으면 화면 뒤에서 업데이트를 피하기 위해 일시적으로 일시 중지할 수 있다.
- 사용자 입력 대기: `queryKey`에 일부 필터 기준이 있지만 사용자가 필터를 적용하지 않는 한 비활성화해라.
- 일부 사용자 입력 후 쿼리 비활성화: 예를 들어 서버 데이터보다 우선해야 하는 초안 값이 있는 경우 일부 사용자 입력 후 쿼리를 비활성화한다.

## queryCache를 로컬 상태 관리자로 사용하지 말아라.

queryCache(`queryCache.setData`)를 조작하는 경우 Optimistic Update 또는 Mutation 후 백엔드에서 수신한 데이터 쓰기만을 위한 것이어야 한다. 모든 백그라운드 다시 가져오기가 해당 데이터를 재정의할 수 있으므로 로컬 상태에 대해 다른 것을 사용해라.

## 사용자 지정 훅 만들기

하나의 `useQuery` 호출을 래핑하기 위한 것 일지라도 사용자 지정 훅을 만드는 것은 일반적으로 다음과 같은 이유로 효과가 있다.

- UI에서 가져오는 실제 데이터를 유지할 수 있지만 `useQuery` 호출과 함께 배치된다.
- 하나의 `queryKey`(및 잠재적으로 유형 정의)의 모든 사용을 하나의 파일에 보관할 수 있다.
- 일부 설정을 조정하거나 데이터 변환을 추가해야 하는 경우 한 곳에서 수행할 수 있다.
