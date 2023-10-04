---
title: 인터페이스란?
date: '2023-09-30'
tags: ['OOP']
draft: false
summary: 인터페이스에 대해서 알아봅시다.
---

## Table of Contents

오늘은 프로그래밍 세계의 중요한 개념 중 하나인 '인터페이스(Interface)'에 대해 알아보려고 합니다. 

# 인터페이스란 무엇인가요?
인터페이스는 ‘사물이 서로 연결되는 부분’이라는 뜻이에요. 예를 들어, 리모컨의 버튼들은 TV와 사용자 사이의 인터페이스입니다. 사용자는 버튼을 눌러 TV에게 무엇을 하라고 명령할 수 있죠.

프로그래밍에서 인터페이스는 여러 객체들이 서로 어떻게 상호작용할지를 정의한 것입니다. 인터페이스에는 ‘어떤 일’을 해야 하는지가 적혀있지만, ‘그 일을 어떻게 해야 하는지’는 적혀있지 않습니다.

# 실생활에서 인터페이스
자동차를 생각해봅시다. 자동차를 운전하기 위해선 운전대, 브레이크, 엑셀러레이터 등이 필요하죠. 이들은 운전자와 자동차 사이의 인터페이스입니다. 운전자는 이들을 사용해 자동차에게 어떤 동작을 하라고 지시할 수 있습니다.

# 프로그래밍에서 인터페이스
프로그래밍의 인터페이스도 마찬가지입니다. 예를 들어, 인터페이스에 ‘앞으로 가기’, ‘뒤로 가기’라는 기능이 정의되어 있다면, 이를 구현한 클래스는 ‘앞으로 가기’, ‘뒤로 가기’라는 동작을 어떻게 해야 할지를 구현해야 합니다.

```java
public interface Movable {
    void moveForward();
    void moveBackward();
}
```

위의 코드는 `Movable`이라는 인터페이스를 정의한 것입니다. 이 인터페이스에는 `moveForward`와 `moveBackward`라는 두 개의 메서드가 정의되어 있습니다.

```java
public class Car implements Movable {
    @Override
    public void moveForward() {
        System.out.println("Car is moving forward.");
    }

    @Override
    public void moveBackward() {
        System.out.println("Car is moving backward.");
    }
}
```

위의 코드는 `Car` 클래스가 `Movable` 인터페이스를 구현한 예시입니다. `Car` 클래스는 `Movable` 인터페이스에서 정의된 모든 메서드를 구현해야 합니다.

# 추상 클래스와 인터페이스의 차이
추상 클래스와 인터페이스는 비슷해 보이지만 몇 가지 중요한 차이점이 있습니다.

- 구현 내용: 추상 클래스는 메서드의 시그니처뿐만 아니라 구현 내용도 포함할 수 있습니다. 반면, 인터페이스는 구현 내용 없이 메서드의 시그니처와 상수만 정의할 수 있습니다.
- 상속: 클래스는 하나의 추상 클래스만 상속받을 수 있습니다. 이를 **단일 상속**이라고 합니다. 반면에, 클래스는 여러 인터페이스를 구현할 수 있습니다.
- 접근 제어자: 추상 클래스의 멤버 변수는 다양한 접근 제어자를 가질 수 있지만, 인터페이스의 변수는 항상 `public` 입니다.
- 생성자: 추상 클래스는 생성자를 가질 수 있지만, 인터페이스는 생성자를 가질 수 없습니다.
이러한 차이점들로 인해, 추상 클래스는 상태와 구현을 상속하기 위해 사용되며, 인터페이스는 메서드 시그니처와 상수를 상속하기 위해 사용됩니다.

# 왜 인터페이스를 사용할까요?
인터페이스를 사용하면 다음과 같은 이점이 있습니다.

- 다중 상속: 하나의 클래스가 여러 인터페이스를 구현할 수 있어요. 이렇게 되면 여러 가지 기능을 동시에 사용할 수 있습니다.
- 추상화: 인터페이스는 ‘무엇을’ 해야 하는지만 정의하므로, 구현 클래스에서는 ‘어떻게’ 그 일을 할지만 신경쓰면 됩니다.
- 유연성과 확장성: 인터페이스를 사용하면 프로그램의 유연성과 확장성이 향상됩니다. 새로운 기능의 추가나 변경이 쉬워집니다.

# 인터페이스로 협업하기
- 프론트엔드 개발자와 백엔드 개발자: 두 그룹 간의 협업은 API 명세서나 API 문서를 통해 이루어집니다. 이 문서는 두 그룹이 서로 데이터를 주고받을 때 필요한 요청 형식, 응답 형식 등의 인터페이스를 명시합니다.

- 프론트엔드 개발자와 디자이너: 디자이너가 제작한 UI/UX 디자인을 프론트엔드 개발자가 코드로 구현하는 과정에서, 디자인 가이드, 색상 코드, 컴포넌트의 상호작용 등의 인터페이스가 정의됩니다.

# 마무리
인터페이스는 프로그래밍에서 객체들이 서로 어떻게 상호작용할지 정의하는 중요한 도구입니다. 인터페이스를 이해하고 잘 활용한다면, 효율적이고 확장성 있는 프로그래밍이 가능해집니다.

또한 인터페이스를 통해 각 역할 간의 명확한 규약과 기대치를 설정함으로써, 협업 과정에서의 오해나 불필요한 반복 작업을 줄이고 효율적으로 작업을 진행할 수 있게 됩니다. 이처럼 인터페이스는 단순히 프로그래밍의 구조를 정의하는 것 뿐만 아니라, 팀의 생산성과 협업의 효율성을 높이는 중요한 역할을 합니다.