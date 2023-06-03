---
title: 개발 경험 향상기 1 - 객체로서 스타일 관리하기
date: '2022-06-17'
tags: ['css-in-js', 'style', '개발 경험 향상기']
draft: false
summary: 객체로서 스타일을 관리하는 방법에 대해서 알아봅시다.
---

CSS-in-JS를 사용하는 개발자라면, 스타일을 객체로서 관리하는 것을 추천합니다. 이런 결론을 내린 과정에 대해 얘기하고자 합니다.

## 프로그래밍적으로 스타일을 관리하기.

아래 예제를 봅시다.

```js
const blue = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
  A100: '#82b1ff',
  A200: '#448aff',
  A400: '#2979ff',
  A700: '#2962ff',
}

const getColors = () => {
  return Object.keys(blue).reduce((prev, cur) => {
    prev[`blue${cur}`] = blue[cur]
    return prev
  }, {})
}

const blueColors = getColors()
```

그러면 다음과 같은 값이 만들어졌을 겁니다.

```js
{
  blue50: '#e3f2fd',
  blue100: '#bbdefb',
  blue200: '#90caf9',
  blue300: '#64b5f6',
  blue400: '#42a5f5',
  blue500: '#2196f3',
  blue600: '#1e88e5',
  blue700: '#1976d2',
  blue800: '#1565c0',
  blue900: '#0d47a1',
  blueA100: '#82b1ff',
  blueA200: '#448aff',
  blueA400: '#2979ff',
  blueA700: '#2962ff'
}
```

이 컬러를 사용하는 쪽을 봅시다.

```jsx
const Button = styled.button`
  background-color: ${colors.blue50}
`
```

얼핏 보면, 문제가 없어보입니다. 하지만 이것을 사용하는 동료 개발자들을 무척 힘들어할 것입니다. 그 이유를 한 번 살펴봅시다.

### 추론이 전혀 되지 않음

이것이 가장 크리티컬한 이유입니다. 항상 사용한 예제 파일과 컬러 파일을 동시에 봐야하는 문제가 생깁니다. IDE가 어떻게 추론되는지 한 번 봅시다.

<img src='/static/images/css-in-js-programming.png' alt="programming exmaple" />


바로 빈 객체로 추론이 됩니다. (이렇게 추론되는 건 너무나도 당연한 얘기입니다. `Array.reducer`는 두 번째 인자 타입으로 리턴하기 때문이죠.)즉, 어떤 프로퍼티가 있으며, 어떤 값이 매핑되어 있는지 전혀 파악이 되지 않는 것입니다.

<iframe src="https://codesandbox.io/embed/cool-cdn-73y7r5?fontsize=14&hidenavigation=1&theme=dark&view=editor"
     style={{ 
        width:"100%",
        height:"500px",
        border:"0",
        borderRadius: "4px",
        overflow: "hidden",
      }}
     title="cool-cdn-73y7r5"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 객체로서 스타일을 관리하기.

```ts
const blue = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
  A100: '#82b1ff',
  A200: '#448aff',
  A400: '#2979ff',
  A700: '#2962ff',
} as const
```

이 컬러를 사용하는 쪽에서 한 번 봅시다.

```tsx
const Button = styled.button`
  background-color: ${colors.blue[50]}
`
```

코드로만 보면 첫 번째 예제와 별반 다를 게 없어보입니다. 하지만 개발 경험은 한층 더 상승했을 겁니다.

<img src='/static/images/css-in-js-object.png' alt="object exmaple" />

사진을 보면 어떤 프로퍼티가 들어있는지 상세하게 말해주고 있습니다.

<iframe src="https://codesandbox.io/embed/adoring-tree-e8fmd0?fontsize=14&hidenavigation=1&theme=dark&view=editor"
      style={{ 
        width:"100%",
        height:"500px",
        border:"0",
        borderRadius: "4px",
        overflow: "hidden",
      }}
     title="adoring-tree-e8fmd0"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

제가 첫 번째 예제애서 사용한 코드는 실제로 본 코드입니다. 이것을 사용해 개발을 진행하다가 생산성이 너무 떨어지는 것을 보고, 어떻게 정리하는 게 좋을까 생각하게 되었습니다. 큰 이변이 없는 한 객체로서 관리하게 될 것 같습니다. 다음에 또 개발 경험을 향상시킨 경험으로 돌아오겠습니다.