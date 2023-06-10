---
title: 죽은 코드 살리기1
date: '2022-07-29'
tags: ['react','refactoring']
draft: false
summary: 회사에 죽은 코드를 살려봅시다.
---

## Motivation
- 기존 코드가 하드 코딩되어 있어서 로직을 바꿔보자는 생각을 했습니다.
- 약관 페이지는 변경될 가능성이 있으니, 로직을 따로 분리해보고자 했습니다.

## 기존 코드의 문제
```tsx
const [agreements, setAgreements] = useState([false, false, false, false, false])
```

- 업데이트하는 로직도 하드코딩 되어있습니다.
- 에러 로직 처리하는 부분이 아주 이상하게 조건이 많았습니다.

## `useState` 대신 `useReducer`를 사용한 이유
- 업데이트 로직을 분리하는 것이 로직을 이해하는 데 더 좋을 것으로 생각했습니다.
- 약관이 추가되거나 삭제가되는 경우, `initialState`, `State`를 활용해 관리할 수 있습니다.
- 업데이트 로직을 분리해서 테스트하기 쉽습니다..

## 코드 설명

### `TermValue`

```ts
type TermValue =
  | "isMoreThan14"
  | "termOfService"
  | "privacy"
  | "privacyThirdParty"
  | "marketing";
```

- `TermValue` 타입은 약관을 나타내는 타입입니다.
- `input`의 `name`으로 들어갑니다.

### `Term`

```ts
type Term = {
  value: TermValue;
  checked: boolean;
  required: boolean;
};
```

- `Term`은 하나의 약관이 갖고 있는 필드입니다.
  - `value`: 약관을 구별해주는 역할을 합니다.
  - `checked`: 체크가 되어있는지 여부를 나타냅니다.
  - `required`: 필수 여부를 나타냅니다.

### `Action`

```ts
type Action =
  | {
    type: TermValue;
    payload: boolean;
  } | {
      type: "allAgreements";
      payload: boolean;
    }
  | {
      type: "reset";
    };
```

- `Action`은 `TermValue`에 있는 것 외에 `allAgreements`와 `reset`이 있는데, 이것은 **전체 선택**과 **값을 초기화**하는 요구사항이 있기 때문입니다.

### `State`

```ts
type State = Term[];

const initialState: State = [
  {
    value: "isMoreThan14",
    checked: false,
    required: true,
  },
  {
    value: "termOfService",
    checked: false,
    required: true,
  },
  {
    value: "privacy",
    checked: false,
    required: true,
  },
  {
    value: "privacyThirdParty",
    checked: false,
    required: false,
  },
  {
    value: "marketing",
    checked: false,
    required: false,
  },
];
```
- `State` 타입은 `initialState`를 정의하는 역할을 합니다.
- `initialState`는 `reducer`에 넣을 초기값 입니다.

### `reducer`

```ts
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "allAgreements":
      return state.map((agreement) => ({
        ...agreement,
        checked: action.payload,
      }));
    case "reset":
      return state.map((agreement) => ({ ...agreement, checked: false }));
    default:
      return state.map((agreement) =>
        agreement.value === action.type
          ? { ...agreement, checked: action.payload }
          : agreement
      );
  }
};
```

- `action.type` is
  - `allAgreements`: 모든 필드를 `action.payload`로 만들어 줍니다.
  - `reset`: 모든 필드를 `false`로 만들어 줍니다..
  - 기본적으로 `action.type`과 같은 필드를 찾아서 `action.payload`로 업데이트 해줍니다.

### `useTerms`

```ts
const useTerms = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onTermChange = (name: Action["type"], checked: boolean) =>
    dispatch({ type: name, payload: checked });

  const allAgreements =
    state.filter((agreemenet) => !agreemenet.checked).length < 1;

  const validateRequired = (terms: State) =>
    terms
      .filter((agreement) => agreement.required)
      .every((agreement) => agreement.checked);

  const reset = () => dispatch({ type: "reset" });

  return {
    agreements: state,
    allAgreements,
    onTermChange,
    validateRequired,
    reset,
  };
};
```

- `onTermChange`: `dispatch`를 이름만 바꿨다고 보면 됩니다.
- `allAgreements`: 전체 선택에 관한 로직 입니다.
  - 하나씩 눌러서 필드 전체의 `checked`가 `true`이면 체크가 됩니다.
  - 필드 전체의 `checked`가 `true`인 상태에서 하나라도 `false`가 되면 체크가 해제됩니다.
- `validateRequired`: `required`가 `true`인 필드는 전부 체크가 되어야 합니다.(`checked: true`)
- `reset`: 모든 필드의 `checked`를 초기화 시킵니다.

조금 더 깔끔해진 모습을 볼 수 있습니다. 하지만 문제점이 있습니다. 그것은 `required` 정보를 `State` 쪽에서 건들여야한다는 점입니다. UI 단에서 `required` `Props`만 넘기도록 만든다면 더 관리하기 좋을 것 같습니다. 다음에는 이것을 **Compound Component Pattern**으로 리팩토링해보는 시간을 가져보겠습니다.