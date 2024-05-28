---
title: 일급 컬렉션
date: '2024-05-29'
tags: ['OOP']
draft: false
summary: 일급 컬렉션에 대해서 알아봅시다.
---

## Table of Contents

이번에는 프로그래밍에서 중요한 개념 중 하나인 "일급 컬렉션(First-Class Collection)"에 대해 알아보겠습니다. 일급 컬렉션은 코드를 더 구조화하고 가독성을 높이며 유지보수성을 향상시키는데 도움을 주는 중요한 개념입니다. 이해하기 쉽도록 Java와 TypeScript 예제를 통해 설명하겠습니다.

# 일급 컬렉션이란?
일급 컬렉션은 단순한 변수나 배열이 아닌, 객체로 컬렉션을 감싸는 개념입니다. 이렇게 하면 컬렉션에 더 많은 의미를 부여하고, 해당 컬렉션과 관련된 동작을 쉽게 구현할 수 있습니다. 이로 인해 코드의 가독성과 유지보수성이 향상됩니다.

# 예시
```java
public class ShoppingCart {
    private List<Item> items;

    public ShoppingCart() {
        this.items = new ArrayList<>();
    }

    // 아이템 추가
    public void addItem(Item item) {
        items.add(item);
    }

    // 아이템 제거
    public void removeItem(Item item) {
        items.remove(item);
    }

    // 총 가격 계산
    public double calculateTotalPrice() {
        double totalPrice = 0;
        for (Item item : items) {
            totalPrice += item.getPrice();
        }
        return totalPrice;
    }
}
```
위의 예제에서 `ShoppingCart`는 일급 컬렉션입니다. `items`라는 컬렉션을 객체로 감싸고, 해당 객체에 관련된 동작들을 메서드로 구현하였습니다.

```typescript
class ShoppingCart {
    private items: Item[] = [];

    // 아이템 추가
    addItem(item: Item): void {
        this.items.push(item);
    }

    // 아이템 제거
    removeItem(item: Item): void {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    // 총 가격 계산
    calculateTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.getPrice(), 0);
    }
}
```

TypeScript 예제도 Java 예제와 유사합니다. `ShoppingCart` 클래스는 일급 컬렉션으로, `items` 배열을 객체로 감싸고 해당 객체에 관련된 동작을 메서드로 구현했습니다.

# 일급 컬렉션의 장점
- 가독성 향상: 코드를 읽고 이해하기 쉽습니다. 컬렉션과 관련된 동작이 한 곳에 모여 있어서 코드의 흐름을 파악하기 쉽습니다.
- 유지보수성 개선: 컬렉션에 새로운 동작을 추가하거나 변경할 때, 해당 일급 컬렉션만 수정하면 됩니다. 이로써 버그를 줄이고 코드를 더 쉽게 유지보수할 수 있습니다.
- 의미 부여: 일급 컬렉션은 이름을 통해 해당 컬렉션의 역할이나 목적을 명확히 나타냅니다.

테스트 용이성: 일급 컬렉션을 사용하면 테스트 작성이 쉬워집니다. 컬렉션 객체를 모의(mock)로 대체하기 쉽고, 테스트 코드를 작성하기 편리합니다.

# 마무리
일급 컬렉션은 코드를 개선하고 유지보수하기 쉽게 만드는 강력한 도구입니다. 컬렉션을 일급 객체로 다루는 습관을 기르면 코드의 품질을 향상시킬 수 있습니다. 따라서 프로그래밍 프로젝트를 진행할 때, 일급 컬렉션을 적극적으로 활용해보세요.