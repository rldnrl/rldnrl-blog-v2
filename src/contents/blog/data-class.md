---
title: Data Class란?
date: '2023-10-04'
tags: ['OOP']
draft: false
summary: Data Class에 대해서 알아봅시다.
---

# Data Class란 무엇인가?

데이터 클래스(data class)는 주로 데이터를 담는 용도로 사용되는 클래스를 의미합니다. 데이터 클래스는 데이터의 표현과 그 데이터에 접근하는 메서드만을 포함하는 간단한 클래스를 가리킵니다. 데이터 클래스는 로직이나 복잡한 연산 없이 순수한 데이터만을 위한 필드와 기본 메서드를 포함하게 됩니다.

# 데이터 클래스의 장점
- 직관성: 클래스의 이름과 필드만 보고도 해당 클래스가 어떤 데이터를 위한 것인지 쉽게 알 수 있습니다.
- 응집도: 데이터 클래스는 그 목적이 단순하기 때문에 높은 응집도를 가집니다.
- 결합도: 데이터 클래스를 사용하면 다른 클래스와의 결합도를 낮출 수 있습니다.

# 응집도와 결합도란?
- 응집도(Cohesion): 하나의 모듈 내부의 기능들이 얼마나 밀접하게 관련되어 있는지를 나타내는 지표입니다. 높은 응집도는 하나의 클래스나 모듈이 특정한 목적/기능을 충실히 수행하도록 설계되었다는 것을 의미합니다.

- 결합도(Coupling): 두 모듈 사이의 의존도를 나타내는 지표입니다. 낮은 결합도는 각 모듈이나 클래스가 서로 독립적으로 동작할 수 있음을 의미하며, 이는 변경이나 유지보수가 쉽다는 장점이 있습니다.

# 예제

```java
public class Person {
    private final String name;
    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

위 클래스는 `Person`이라는 데이터를 위한 클래스로, 이름과 나이를 저장하고 있습니다. 복잡한 연산이나 메서드 없이 간단히 데이터만을 관리하고 있죠.

# 결론
데이터 클래스는 프로그래밍에서 데이터를 효과적으로 관리하기 위한 중요한 도구입니다. 높은 응집도와 낮은 결합도를 유지하면서, 코드의 가독성과 유지 보수성을 향상시키기 위해 데이터 클래스를 적절하게 사용하는 것이 중요합니다.

