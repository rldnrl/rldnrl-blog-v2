---
title: Container Presentational Pattern
date: '2023-12-02'
tags: ["react", "design-pattern"]
draft: false
summary: Container Presentational Pattern에 대해서 알아봅시다.
---

Presentational 컴포넌트와 Container 컴포넌트는 React 개발에서 중요한 패턴으로, 이들은 컴포넌트의 관심사를 명확하게 분리하여 애플리케이션의 구조를 더욱 효율적이고 유지보수하기 쉽게 만듭니다.

### Presentational Component

Presentational 컴포넌트는 주로 UI를 어떻게 보여줄 것인지에 집중합니다. 이 컴포넌트는 외부에서 `props`를 통해 데이터를 받아서 화면에 표시하는 역할을 합니다. 주요 특징은 다음과 같습니다:

- **데이터 처리를 하지 않음**: 오로지 받은 `props`를 통해 UI를 렌더링합니다.
- **상태를 최소한으로 유지**: UI 관련 상태(예: 토글 상태) 외에는 상태를 가지지 않습니다.
- **재사용성**: 다양한 컨테이너 컴포넌트로부터 데이터를 받아 여러 곳에서 재사용될 수 있습니다.
- **스타일링 포함**: UI를 어떻게 보여줄지 결정하기 때문에 CSS를 포함할 수 있습니다.

```jsx
import React from 'react';

function BookList({ books }) {
  return (
    <ul>
      {books.map(book => (
        <li key={book.id}>{book.title} - {book.author}</li>
      ))}
    </ul>
  );
}

export default BookList;
```

### Container Component

Container 컴포넌트는 데이터를 처리하고 Presentational 컴포넌트에 전달합니다. 이 컴포넌트는 다음과 같은 특징을 가집니다:

- **화면에 직접 렌더링하지 않음**: UI를 직접 그리지 않고, 데이터를 처리하고 Presentational 컴포넌트에 전달합니다.
- **데이터 소스를 관리**: 외부 API 호출, 상태 관리 라이브러리 연동 등을 담당합니다.
- **스타일링 없음**: 화면에 직접적인 렌더링이 없으므로 CSS를 포함하지 않습니다.

```jsx
import React, { useState, useEffect } from 'react';
import BookList from './BookList';

function BookListContainer() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // 가정: 외부 API에서 책 목록을 가져오는 함수
    fetchBooks().then(data => setBooks(data));
  }, []);

  return <BookList books={books} />;
}

export default BookListContainer;
```

이러한 방식으로 컴포넌트를 구성함으로써, UI와 데이터 처리 로직을 명확하게 분리하여 애플리케이션의 유지보수성과 확장성을 높일 수 있습니다. Presentational 컴포넌트는 다양한 컨테이너 컴포넌트로부터 데이터를 받아 재사용되며, Container 컴포넌트는 데이터 관리에 집중하여 애플리케이션의 데이터 흐름을 효율적으로 관리할 수 있습니다.

## 결론
Presentational 컴포넌트와 Container 컴포넌트의 분리는 React 애플리케이션을 구축할 때 매우 중요한 패턴입니다. 이러한 분리는 다음과 같은 중요한 장점을 제공합니다:

1. **관심사의 명확한 분리**: UI를 담당하는 Presentational 컴포넌트와 데이터 처리를 담당하는 Container 컴포넌트로 역할이 분명히 나뉩니다. 이로 인해 각 컴포넌트는 자신의 역할에만 집중할 수 있어 코드의 가독성과 유지보수성이 향상됩니다.
    
2. **재사용성 증가**: Presentational 컴포넌트는 데이터에 의존하지 않고 순수하게 UI를 표현하는 데 집중하기 때문에, 다양한 컨텍스트에서 재사용될 수 있습니다. 이는 애플리케이션의 일관성을 유지하면서 개발 시간을 절약하는 데 도움이 됩니다.
    
3. **테스트 용이성**: 컴포넌트가 명확하게 분리되어 있어서 각 컴포넌트를 독립적으로 테스트하기 쉽습니다. Presentational 컴포넌트는 UI와 사용자 상호작용을 테스트하는 데 집중할 수 있고, Container 컴포넌트는 데이터 처리와 비즈니스 로직의 테스트에 집중할 수 있습니다.
    
4. **유연성과 확장성**: 애플리케이션이 성장하고 복잡해짐에 따라, 이러한 분리는 코드를 관리하고 확장하기 쉽게 만들어 줍니다. 특히 대규모 팀에서는 각 팀원이 UI와 데이터 로직의 분리된 부분을 독립적으로 작업할 수 있어 효율적인 협업이 가능해집니다.
    