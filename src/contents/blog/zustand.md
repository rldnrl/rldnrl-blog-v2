---
title: Zustand 번역
date: '2021-9-28'
tags: ['zustand']
draft: false
summary: Zustand를 번역한 글이다.
---

# Zustand

간단한 Flux 원칙을 사용하는 작고 빠르고 확장 가능한 상태 관리 솔루션입니다. Hook 기반으로 하는 편리한 API가 있습니다.

## 먼저 스토어 생성

store는 hook입니다! 어떤 것이든 넣을 수 있습니다(원시 타입, 객체, 함수). `set` 함수는 상태를 병합(Merge)합니다.

```tsx
import create from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
```

## 그런 다음 컴포넌트에 바인딩합니다.

```tsx
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

## 왜 redux보다 zustand인가요?

- 단순하고 의견이 없음
- hook를 상태 소비의 주요 수단으로 만듦.(Makes hooks the primary means of consuming state)
- Provider로 래핑하지 않아도 됨.
- 컴포넌트에 일시적으로 알릴 수 있음.(렌더링을 일으키지 않음)

## 왜 context보다 zustand인가요?

- boilerplate가 적음.
- 변경 시에만 컴포넌트 렌더링
- 중앙 집중식, action 기반의 상태 관리

<br />

# Recipes

## Fetching everything

할 수 있지만 모든 상태가 변경될 때마다 컴포넌트가 업데이트된다는 점을 염두에 두십시오!

```tsx
const store = useStore()
```

## Selecting multiple state slices

기본적으로 엄격한 동등(old === new)으로 변경 사항을 감지합니다. 이것은 원자 상태 선택에 효율적입니다.

```tsx
const nuts = useStore((state) => state.nuts)
const honey = useStore((state) => state.honey)
```

redux의 `mapStateToProps와` 유사하게 내부에 여러 상태 선택이 있는 단일 객체를 생성하려는 경우 zustand에게 `shallow` 동등 함수를 전달하여 객체가 얕게 비교하기를 원한다고 말할 수 있습니다.

```tsx
import shallow from 'zustand/shallow'

// Object pick, state.nuts이나 state.honey가 변할 때 컴포넌트가 재렌더링
const { nuts, honey } = useStore((state) => ({ nuts: state.nuts, honey: state.honey }), shallow)

// Array pick, state.nuts이나 state.honey가 변할 때 컴포넌트가 재렌더링
const [nuts, honey] = useStore((state) => [state.nuts, state.honey], shallow)

// Mapped picks, state.treats에서 순서, 개수, 키가 변경될 때 재렌더링
const treats = useStore((state) => Object.keys(state.treats), shallow)
```

재렌더링에 대한 더 많은 제어를 위해 사용자 정의 동등 함수를 제공할 수 있습니다.

```tsx
const treats = useStore(
  (state) => state.treats,
  (oldTreats, newTreats) => compare(oldTreats, newTreats) // 사용자 정의 함수
)
```

## Memoizing selectors

일반적으로 `useCallback`으로 selector를 메모하는 것이 좋습니다. 이렇게 하면 렌더링할 때마다 불필요한 계산이 방지됩니다. 또한 React가 동시 모드에서 성능을 최적화할 수 있습니다.

```tsx
const fruit = useStore(useCallback((state) => state.fruits[id], [id]))
```

selector가 범위에 의존하지 않는 경우, `useCallback` 없이 고정 참조를 얻기 위해 렌더 함수 외부에서 select를 정의할 수 있습니다.

```tsx
const selector = state => state.berries

function Component() {
  const berries = useStore(selector)
```

## Overwriting state

`set` 함수에는 기본적으로 `false`인 두 번째 인수가 있습니다. 병합하는 대신 상태 모델을 대체합니다. 액션 등 의존하는 부분이 지워지지 않도록 주의하세요.

```tsx
import omit from 'lodash-es/omit'

const useStore = create((set) => ({
  salmon: 1,
  tuna: 2,
  deleteEverything: () => set({}, true), // 액션을 포함한 전체 저장소 지우기
  deleteTuna: () => set((state) => omit(state, ['tuna']), true),
}))
```

## 비동기 액션

준비가 되면 `set`을 호출하면 됩니다. zustand는 작업이 비동기인지 아닌지 상관하지 않습니다.

```tsx
const useStore = create((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
  },
}))
```

## Action 안에 상태 읽기

```tsx
const useStore = create((set, get) => ({
  sound: "grunt",
  action: () => {
    const sound = get().sound
    // ...
  }
})
```

`set`은 fn-updates `set(state => result)`를 허용하지만 `get`을 통해 외부 상태에 계속 액세스할 수 있습니다.

## 상태 읽기/쓰기 및 구성 요소 외부의 변경 사항에 대한 반응

때로는 reactive 하지 않은 방식으로 state에 접근하거나 store에 대해 조치를 취해야 합니다. 이러한 경우 result hook에는 프로토타입에 첨부된 유틸리티 기능이 있습니다.

```tsx
const useStore = create(() => ({ paw: true, snout: true, fur: true }))

// Getting non-reactive fresh state
const paw = useStore.getState().paw
// Listening to all changes, fires on every change
const unsub1 = useStore.subscribe(console.log)
// Listening to selected changes, in this case when "paw" changes
const unsub2 = useStore.subscribe(console.log, state => state.paw)
// Subscribe also supports an optional equality function
const unsub3 = useStore.subscribe(console.log, state => [state.paw, state.fur], shallow)
// Subscribe also exposes the previous value
const unsub4 = useStore.subscribe((paw, previousPaw) => console.log(paw, previousPaw), state => state.paw)
// Updating state, will trigger listeners
useStore.setState({ paw: false })
// Unsubscribe listeners
unsub1()
unsub2()
unsub3()
unsub4()
// Destroying the store (removing all listeners)
useStore.destroy()

// You can of course use the hook as you always would
function Component() {
  const paw = useStore(state => state.paw)
```

## React 없이 Zustand 사용하기

Zustand 코어는 React 종속성 없이 가져와서 사용할 수 있습니다. 유일한 차이점은 create 함수가 hook를 반환하지 않고 api 유틸리티를 반환한다는 것입니다.

```tsx
import create from 'zustand/vanilla'

const store = create(() => ({ ... }))
const { getState, setState, subscribe, destroy } = store
```

React로 기존 vanilla store를 사용할 수도 있습니다.

```tsx
import create from 'zustand'
import vanillaStore from './vanillaStore'

const useStore = create(vanillaStore)
```

⚠ `set` 또는 `get`을 수정하는 미들웨어는 `getState` 및 `setState`에 적용되지 않습니다.

## 일시적인 업데이트(자주 발생하는 상태 변경의 경우)

`subscribe` 기능을 사용하면 컴포넌트가 변경 사항을 강제로 다시 렌더링하지 않고 상태 부분에 바인딩할 수 있습니다. 마운트 해제 시 자동 구독 취소를 위해 `useEffect`와 결합하는 것이 가장 좋습니다. 뷰를 직접 변경할 수 있는 경우 성능에 큰 영향을 줄 수 있습니다.

```tsx
const useStore = create(set => ({ scratches: 0, ... }))

function Component() {
  // Fetch initial state
  const scratchRef = useRef(useStore.getState().scratches)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => useStore.subscribe(
    scratches => (scratchRef.current = scratches),
    state => state.scratches
  ), [])
```

## reducer와 중첩 상태(nested state) 변경에 지쳤습니까? immer를 사용하세요!

중첩 구조를 줄이는 것은 귀찮습니다. [immer](https://immerjs.github.io/immer/) 해보셨나요?

```tsx
import produce from 'immer'

const useStore = create((set) => ({
  lush: { forest: { contains: { a: 'bear' } } },
  clearForest: () =>
    set(
      produce((state) => {
        state.lush.forest.contains = null
      })
    ),
}))

const clearForest = useStore((state) => state.clearForest)
clearForest()
```

## Middleware

기능적으로 원하는 방식으로 store을 구성할 수 있습니다.

```tsx
// Log every time state is changed
const log = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log('  applying', args)
      set(args)
      console.log('  new state', get())
    },
    get,
    api
  )

// Turn the set method into an immer proxy
const immer = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const nextState = typeof partial === 'function' ? produce(partial) : partial
      return set(nextState, replace)
    },
    get,
    api
  )

const useStore = create(
  log(
    immer((set) => ({
      bees: false,
      setBees: (input) => set((state) => void (state.bees = input)),
    }))
  )
)
```

<details>
<summary>How to pipe middlewares</summary>

```tsx
import create from 'zustand'
import produce from 'immer'
import pipe from 'ramda/es/pipe'

/* log and immer functions from previous example */
/* you can pipe as many middlewares as you want */
const createStore = pipe(log, immer, create)

const useStore = createStore((set) => ({
  bears: 1,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}))

export default useStore
```

For a TS example see the following [discussion](https://github.com/pmndrs/zustand/discussions/224#discussioncomment-118208)

</details>

<details>
<summary>How to type immer middleware in TypeScript</summary>

```tsx
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: 'food-storage', // unique name
      getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
    }
  )
)
```

</details>

<details>
<summary>How to use custom storage engines</summary>

고유한 StateStorage를 정의하여 localStorage 및 sessionStorage 외부의 다른 저장 방법을 사용할 수 있습니다. 사용자 지정 StateStorage 개체를 사용하면 저장소 데이터를 가져오거나 설정할 때 지속 저장소에 대한 미들웨어를 작성할 수도 있습니다.

```tsx
import create from 'zustand'
import { persist, StateStorage } from 'zustand/middleware'
import { get, set } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved')
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    set(name, value)
  },
}

export const useStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: 'food-storage', // unique name
      getStorage: () => storage,
    }
  )
)
```

</details>

## redux와 같은 리듀서와 액션 타입 없이는 살 수 없습니까?

```tsx
const types = { increase: 'INCREASE', decrease: 'DECREASE' }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase:
      return { grumpiness: state.grumpiness + by }
    case types.decrease:
      return { grumpiness: state.grumpiness - by }
  }
}

const useStore = create((set) => ({
  grumpiness: 0,
  dispatch: (args) => set((state) => reducer(state, args)),
}))

const dispatch = useStore((state) => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```

또는 redux-middleware를 사용하십시오. 메인 리듀서를 연결하고 초기 상태를 설정하며 상태 자체와 기본 API에 디스패치 기능을 추가합니다. 이 [예시](https://codesandbox.io/s/amazing-kepler-swxol)를 시도하십시오.

```tsx
import { redux } from 'zustand/middleware'

const useStore = create(redux(reducer, initialState))
```

## React 이벤트 핸들러 외부에서 액션 호출

React는 이벤트 핸들러 외부에서 호출되는 경우 `setState`를 동기적으로 처리하기 때문입니다. 이벤트 핸들러 외부에서 상태를 업데이트하면 컴포넌트가 동기적으로 업데이트되도록 반응하므로 zombie-child 효과가 발생할 위험이 추가됩니다. 이 문제를 해결하려면 작업을 `unstable_batchedUpdates`로 래핑해야 합니다.

```tsx
import { unstable_batchedUpdates } from 'react-dom' // or 'react-native'

const useStore = create((set) => ({
  fishes: 0,
  increaseFishes: () => set((prev) => ({ fishes: prev.fishes + 1 })),
}))

const nonReactCallback = () => {
  unstable_batchedUpdates(() => {
    useStore.getState().increaseFishes()
  })
}
```

## Redux devtools

```tsx
import create from 'zustand'
import { devtools } from 'zustand/middleware'

// Usage with a plain action store, it will log actions as "setState"
const useStore = create(devtools(store))
// Usage with a redux store, it will log full action types
const useStore = create(devtools(redux(reducer, initialState)))
```

`devtools`는 첫 번째 인수로 store 함수를 사용합니다. 선택적으로 두 번째 인수로 저장소 이름을 지정하거나 직렬화 옵션을 구성할 수 있습니다.

Name Store: `devtools(store, { name: "MyStore" })`, 액션 앞에 붙습니다.
직렬화 옵션: `devtools(store, { serialize: { options: true } })`.

`devtools`는 일반적인 결합형 리듀서 redux 저장소와 달리 각 분리된 저장소의 작업만 기록합니다. store 결합 방법 보기 https://github.com/pmndrs/zustand/issues/163

## React context

`create`로 생성된 store는 Context Provider가 필요하지 않습니다. 어떤 경우에는 종속성 주입(Dependency Injection)을 위해 컨텍스트를 사용하거나 컴포넌트의 Props로 store를 초기화하려는 경우가 있습니다. store는 hook이므로 일반 컨텍스트 값으로 전달하면 hook 규칙을 위반할 수 있습니다. 오용을 방지하기 위해 특별한 createContext가 제공됩니다.

```tsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
}
```

<details>
  <summary>createContext usage in real components</summary>

```jsx
import create from "zustand";
import createContext from "zustand/context";

// Best practice: You can move the below createContext() and createStore to a separate file(store.js) and import the Provider, useStore here/wherever you need.

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 })
  }));

const Button = () => {
  return (
      {/** store() - This will create a store for each time using the Button component instead of using one store for all components **/}
    <Provider createStore={createStore}>
      <ButtonChild />
    </Provider>
  );
};

const ButtonChild = () => {
  const state = useStore();
  return (
    <div>
      {state.bears}
      <button
        onClick={() => {
          state.increasePopulation();
        }}
      >
        +
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Button />
      <Button />
    </div>
  );
}
```

</details>

<details>
  <summary>createContext usage with initialization from props (in TypeScript)</summary>

```tsx
import create from 'zustand'
import createContext from 'zustand/context'

type BearState = {
  bears: number
  increase: () => void
}

// pass the type to `createContext` rather than to `create`
const { Provider, useStore } = createContext<BearState>()

export default function App({ initialBears }: { initialBears: number }) {
  return (
    <Provider
      createStore={() =>
        create((set) => ({
          bears: initialBears,
          increase: () => set((state) => ({ bears: state.bears + 1 })),
        }))
      }
    >
      <Button />
    </Provider>
  )
}
```

</details>

## Typing your store and `combine` middleware

```tsx
// You can use `type`
type BearState = {
  bears: number
  increase: (by: number) => void
}

// Or `interface`
interface BearState {
  bears: number
  increase: (by: number) => void
}

// And it is going to work for both
const useStore = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

또는 `combine`을 사용하고 tsc가 유형을 추론하도록 합니다. 이것은 두 상태를 얕게 병합합니다.

```tsx
import { combine } from 'zustand/middleware'

const useStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  }))
)
```

## Best practices

- 더 나은 유지 관리를 위해 코드를 구성하는 방법이 궁금할 수 있습니다.: [Splitting the store into seperate slices](https://github.com/pmndrs/zustand/wiki/Splitting-the-store-into-separate-slices).
- 이 의견이 없는 라이브러리에 대한 권장 사용법: [Flux inspired practice](https://github.com/pmndrs/zustand/wiki/Flux-inspired-practice).

## Testing

Zustand를 사용한 테스트에 대한 정보는 위키를 참조하세요. [Wiki page](https://github.com/pmndrs/zustand/wiki/Testing).

## 3rd-Party Libraries

일부 사용자는 커뮤니티에서 만든 타사 라이브러리를 사용하여 수행할 수 있는 Zustand의 기능 세트를 확장하기를 원할 수 있습니다. Zustand가 포함된 타사 라이브러리에 대한 정보는 전용는 위키를 참조하세요. [Wiki page](https://github.com/pmndrs/zustand/wiki/3rd-Party-Libraries).

## Comparison with other libraries

- [Difference between zustand and valtio](https://github.com/pmndrs/zustand/wiki/Difference-between-zustand-and-valtio)
