---
title: Compound Component Pattern
date: '2022-07-23'
tags: ['React', 'TypeScript', 'Design-Pattern']
draft: false
summary: Compound Component 패턴에서 대해서 알아봅시다.
---

## Compound Component Pattern이란?

compound component는 특정 작업을 수행하기 위해 함께 작동하는 둘 이상의 컴포넌트 집합입니다. 컴포넌트 집합은 암시적 상태를 공유하여 컴포넌트 간에 통신합니다.

> HTML의 `select` 및 `option` 엘리먼트와 같은 compound component를 생각해 보십시오. 따로 하는 것은 많지 않지만 함께 사용하면 완전한 경험을 만들 수 있습니다. - Kent C. Dodds

```html
<select>
  <option>Option1</option>
  <option>Option2</option>
  <option>Option3</option>
  <option>Option4</option>
</select>
```

`select` 컴포넌트에서 `option`을 클릭하면 `select`은 사용자가 클릭한 `option`을 압니다. `select`와 `option`은 그들 사이에서 상태를 공유하고 선택된 옵션 상태를 자체적으로 업데이트하므로 명시적으로 구성할 필요가 없습니다.

## Compound Component in Action

Accordion 컴포넌트를 Compound Component 패턴을 사용해서 만들어봅시다.

Accordion 컴포넌트는 다음 4가지 컴포넌트가 있을 겁니다.

1. `Accordion` - Accordion 컴포넌트의 Wrapper 컴포넌트 입니다.
2. `AccordionItem` - 각 Accordion 항목을 정의할 수 있는 컴포넌트 입니다. 각 `AccordionItem`에는 `AccordionButton` 및 `AccordionPanel` 컴포넌트가 있습니다.
3. `AccordionButton` - Accordion 컴포넌트의 헤더입니다. Accordion 버튼을 클릭하면 해당 Accordion 패널이 열립니다.
4. `AccordionPanel` - Accordion 패널입니다. 이것은 각 Accordion 항목의 내용을 보유합니다.

위에서 언급한 컴포넌트를 하나씩 만들고 이들 간의 연결을 만드는 방법을 살펴보겠습니다. Accordion 컴포넌트부터 만들어봅시다. Accordion 컴포펀트는 다른 모든 필수 컴포펀트를 래핑하고 다른 모든 컴포펀트 간에 공유될 상태를 유지합니다. 그렇다면 자연스럽게 [Context API](https://ko.reactjs.org/docs/context.html)를 사용해야겠죠?

> Context는 모든 Level에서 수동으로 `props`를 전달하지 않고도 컴포넌트 트리를 통해 데이터를 전달할 수 있는 방법을 제공합니다.

```tsx
// AccordionContext.tsx

import { createContext, useContext } from "react";

export type AccordionContextType = {
  activeItem: string;
  changeSelectedItem: (item: string) => void;
};

const AccordionContext = createContext<AccordionContextType>({
  activeItem: "",
  changeSelectedItem: () => {},
});

export const useAccordionContext = () => useContext(AccordionContext);

export default AccordionContext;
```

이제 Context를 만들었습니다. Context를 생성한 후 Context에 값을 제공해야 하며 이는 `Context.Provider` 엘리먼트에 의해 수행됩니다.

```tsx
// Accordion.tsx

import { FunctionComponent, ReactNode, useCallback, useState } from "react";
import AccordionContext from "./AccordionContext";

import "./Accordion.style.css";

export type AccrodionProps = {
  children: ReactNode | ReactNode[];
};

const Accordion: FunctionComponent<AccrodionProps> = ({ children }) => {
  const [activeItem, setActiveItem] = useState("");

  const changeActiveItem = useCallback(
    (value: string) => {
      if (activeItem !== value) setActiveItem(value);
      if (activeItem === value) setActiveItem("");
    },
    [setActiveItem, activeItem]
  );

  return (
    <AccordionContext.Provider
      value={{ activeItem, changeSelectedItem: changeActiveItem }}
    >
      {children}
    </AccordionContext.Provider>
  );
};

export default Accordion;
```

우리는 `Accordion` 컨테이너 컴포넌트를 만들었으며 `Context`에 값을 제공했습니다. 이제 나머지 컴포넌트를 만들고, `Context`의 값을 사용하고 `Accordion` 컴포넌트가 전체적으로 작동하도록 해야 합니다.


```tsx
// AccordionItem.tsx

import {
  Children,
  cloneElement,
  FunctionComponent,
  isValidElement,
  ReactNode,
} from "react";

type AccordionItemProps = {
  children: ReactNode[];
  label: string;
  className?: string;
};

export const AccordionItem: FunctionComponent<AccordionItemProps> = ({
  children,
  label,
  className,
}) => {
  const childrenArray = Children.toArray(children);

  // label is used to distinguish between each accordion element.
  // Adding the label prop to the children of accordionItem along with other props.
  const accordionItemChildren = childrenArray.map((child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        ...child.props,
        label,
      });
    }
    return null;
  });

  return <div className={className}>{accordionItemChildren}</div>;
};

export default AccordionItem;
```

```tsx
// AccordionButton.tsx

import { FunctionComponent, ReactNode, useCallback } from "react";
import { useAccordionContext } from "./AccordionContext";

type AccordionButtonProps = {
  children: ReactNode;
  label?: string;
  className?: string;
};

const AccordionButton: FunctionComponent<AccordionButtonProps> = ({
  label,
  children,
  className,
}) => {
  const { changeSelectedItem } = useAccordionContext();

  const accordionButtonClickHandler = useCallback(() => {
    changeSelectedItem(label || "");
  }, [changeSelectedItem, label]);

  return (
    <div
      onClick={accordionButtonClickHandler}
      className={`accordion-button ${className}`}
    >
      {children}
    </div>
  );
};

export default AccordionButton;
```

```tsx
// AccordionPanel.tsx

import { FunctionComponent, ReactNode } from "react";
import { useAccordionContext } from "./AccordionContext";

type AccordionPanelProps = {
  children: ReactNode;
  label?: string;
  className?: string;
};

const AccordionPanel: FunctionComponent<AccordionPanelProps> = ({
  children,
  label,
  className,
}) => {
  const { activeItem } = useAccordionContext();

  const panelStyles = [
    "accordion-panel",
    label === activeItem ? "show-item" : "hide-item",
    className,
  ].join(" ");

  return <div className={panelStyles}>{children}</div>;
};

export default AccordionPanel;
```

이제 필요한 다른 컴포넌트들을 만들었습니다. 하나씩 살펴봅시다.

- `AccordionPanel`과 `AccordionButton` 컴포넌트에서 `useAccordionContext`를 사용했습니다. 이것이 `Accordion` 컴포넌트에서 제공되는 데이터를 얻는 방법입니다.
- 버튼을 클릭할 때 active된 항목을 업데이트하기 위해 `AccordionButton` 컴폰넌트에서 `changeSelectedItem`을 사용합니다.
- 내용을 표시하거나 숨길지 여부에 관계없이 `AccordionPanel` 컴포넌트에서 `activeItem`을 사용합니다.

이제 `Accordion` 컴포넌트를 완전히 만들었습니다. 이제 `Accordion` 컴포넌트를 사용하는 방법을 살펴보겠습니다.

```tsx
// App.tsx

import "./App.css";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "./libs/ui/Accordion";

function App() {
  return (
    <div className="App">
      <Accordion>
        <AccordionItem label="react">
          <AccordionButton>React</AccordionButton>
          <AccordionPanel>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem label="angular">
          <AccordionButton>Angular</AccordionButton>
          <AccordionPanel>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem label="javascipt">
          <AccordionButton>Javasciprt</AccordionButton>
          <AccordionPanel>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default App;
```

완성입니다!

## 느낀 점

Compound Component 패턴을 공부하면서 느낀 것은 관련 있는 컴포넌트끼리 State를 공유하는 것이 관심사 분리적인 면에서 좋다는 것입니다. 컴포넌트를 만들다보면, State가 거대해지고, Props가 거대해지는 것을 많이 경험했습니다. 추가적으로 Props Drilling까지 일어나게 되죠. State와 로직을 Context에서 관리하고 그것을 구독하고 있는 컴포넌트에서 가져다 쓰는 게 깔끔한 것 같습니다.

## 출처
- [React compound components (Hooks + typescript)](https://hashnode.com/post/react-compound-components-hooks-typescript-ckpf00izg033kkms134jo828m)