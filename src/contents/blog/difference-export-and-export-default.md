---
title: export와 export default 차이 (트리쉐이킹 관점에서)
date: '2023-11-27'
tags: ["Bundle"]
draft: false
summary: export와 export default 차이에 대해서 알아봅시다.
---


JavaScript 모듈 시스템은 코드의 재사용성과 유지보수성을 높이는 데 큰 도움이 됩니다. 특히, React와 TypeScript를 사용하는 현대 웹 개발에서 `export`와 `export default`는 모듈을 관리하는 두 가지 주요 방법입니다. 이 글에서는 이 두 방법의 차이점을 트리 쉐이킹의 관점에서 분석하고, 각각의 사용 사례를 React와 TypeScript 예제를 통해 설명하겠습니다.

## export

`export`는 여러 기능이나 컴포넌트를 개별적으로 내보낼 수 있게 해줍니다. 이를 통해 다른 파일에서 필요한 것만 선택적으로 가져올 수 있습니다.

`components.tsx` 파일에서 여러 React 컴포넌트를 정의하고 내보내보겠습니다.

```ts
import styled from "@emotion/styled";

epxort const Button = styled.button`
	padding: 8px 16px;
`;

type FlexProps = Pick<CSSProperties, "justifyContent" | "alignItems">;

epxort const Flex = styled.div<FlexProps>`
	display: flex;
	justify-content: ${(props) => props.justifyContent};
	align-items: ${(props) => props.alignItems};
`;

export const Grid = styled.div`
	display: grid;
`;

```

`App.tsx` 에서 특정 컴포넌트만 가져와서 사용해보겠습니다.

```tsx
import { useState } from "react";
import * as S from "./components";

function App() {
  const [count, setCount] = useState(0);

  return (
    <S.Flex className="card">
      <S.Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </S.Button>
    </S.Flex>
  );
}

export default App;
```

### 빌드 결과
```
vite v5.0.2 building for production...
✓ 65 modules transformed.
dist/index.html                  0.39 kB │ gzip:  0.27 kB
dist/assets/index-T7kOnhk6.js  164.50 kB │ gzip: 54.96 kB
✓ built in 476ms
✨  Done in 1.38s.
```

## export default
`export default`는 모듈당 하나의 기본 내보내기를 의미합니다. 이는 주로 모듈 전체가 하나의 클래스나 함수일 때 사용됩니다.

`components.tsx` 파일에서 여러 React 컴포넌트를 정의하고 내보내보겠습니다.

```ts
import styled from "@emotion/styled";

const Button = styled.button`
	padding: 8px 16px;
`;

type FlexProps = Pick<CSSProperties, "justifyContent" | "alignItems">;

const Flex = styled.div<FlexProps>`
	display: flex;
	justify-content: ${(props) => props.justifyContent};
	align-items: ${(props) => props.alignItems};
`;

const Grid = styled.div`
	display: grid;
`;

export default { Button, Flex, Grid };

```

`App.tsx` 에서 사용해보겠습니다.

```tsx
import { useState } from "react";
import S from "./components";

function App() {
  const [count, setCount] = useState(0);

  return (
    <S.Flex className="card">
      <S.Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </S.Button>
    </S.Flex>
  );
}

export default App;
```

### 빌드 결과
```
vite v5.0.2 building for production...
✓ 65 modules transformed.
dist/index.html                  0.39 kB │ gzip:  0.27 kB
dist/assets/index-owU2x0b6.js  164.54 kB │ gzip: 54.98 kB
✓ built in 477ms
✨  Done in 1.44s.
```

## 결론

`export`와 `export default`를 비교했을 때, `export default` 사용 시 번들 사이즈가 더 큰 것을 확인할 수 있습니다. 이는 사용하지 않는 컴포넌트도 함께 빌드되는 결과를 초래하기 때문입니다. 이는 트리 쉐이킹의 관점에서 `export` 방식이 더 효율적임을 의미합니다. `export`를 사용하면 필요한 부분만 가져오므로 최종 빌드에 불필요한 코드가 포함되지 않아 성능 최적화에 유리합니다.