---
title: string 타입 좁히기
date: '2022-01-09'
tags: ['typescript']
draft: false
summary: string 타입을 좁혀야하는 이유와 좁히는 방법에 대해서 알아봅시다.
---

## String Literal을 사용

TypeScript에서 `string`은 마치 `any`와 비슷합니다. `string`으로 표현할 수 있는 것들이 너무 많기 때문이죠. 예제를 통해서 한 번 알아봅시다.

```ts
interface Album {
  title: string;
  // date format: YYYY-MM-DD
  date: string;
  // type is "studio", "live"
  recordingType: string;
  // genre is "jazz", "classic", "hiphop"
  genre: string;
}

const leeRitenour: Album = {
  title: "Rio",
  date: "1979-08-17",
  recordingType: "Studio",
  genre: "Jazz",
};

function releaseAlbum(title: string, date: string) {}

releaseAlbum(leeRitenour.date, leeRitenour.title);
```

일단 어느 부분이 잘못되었는지 한 번 살펴봅시다.

1. 인터페이스가 주석정보와 일치하지 않습니다.
인터페이스를 주석으로 표시를 했지만, 표시하지 않는 것이 더 좋습니다. 타입으로 충분히 표현될 수 있기 때문이죠. 그리고 주석 문서가 업데이트 되지 않아 잘못된 정보를 줄 수 있기 때문입니다.

2. `releaseAlbum` 함수의 인자가 뒤바뀌어 있습니다.
개발자가 실수해서 다음과 같이 작성을 했습니다. 당연히 오류가 발생을 하겠죠? 하지만 TypeScript는 오류가 발생한 건지 모릅니다. 왜냐하면 `string` 타입이 들어왔기 때문이죠.

이처럼 `string` 타입은 너무 넓기 때문에 좁혀주는 게 좋습니다. 개선된 코드를 한 번 살펴보도록 합시다.

```ts
interface Album {
  title: string;
  date: Date
  recordingType: "studio" | "live";
  genre: "jazz" | "classic" | "hiphop";
}

const leeRitenour: Album = {
  title: "Rio",
  date: new Date("1979-08-17"),
  recordingType: "Studio", // Type '"Studio"' is not assignable to type '"studio" | "live"'.
  genre: "jazz",
};

function releaseAlbum(title: string, date: Date) {}

releaseAlbum(leeRitenour.date, leeRitenour.title); 
// Argument of type 'Date' is not assignable to parameter of type 'string'.
// Argument of type 'string' is not assignable to parameter of type 'Date'.
```

TypeScript가 정확하게 오류를 파악하고 있습니다. 그러면 개발 경험이 올라가겠죠?

## Template Literal Type을 사용

이번에는 TypeScript 4.1 버전에서 지원하는 **Template Literal Type**에 대해서 알아봅시다.

예를 들어서 CSS의 단위를 변환해주는 함수가 있다고 생각해봅시다. 이것은 `number`일 경우 `px`을 붙여주고, `string` 경우에는 `px, em, rem, %`가 들어올 수 있습니다.

```ts
type CSSValue = number | string;

const toCssUnit = (value: CSSValue) => {
  return typeof value === "number" ? `${value}px` : value;
};

toCssUnit(17) // 17px
toCssUnit("20px") // 20px
toCssUnit("20em") // 20em
toCssUnit("20rem") // 20rem
toCssUnit("100%") // 100%
toCssUnit("20ex") // ???
```

마지막 라인에 보면 잘못된 값이 들어온 것을 알 수 있습니다. 잘못되었지만 TypeScript가 발견을 못했습니다. TypeScript가 발견할 수 있도록 조치를 취해봅시다.

```ts
type CSSValue =
  | number
  | `${string}px`
  | `${string}em`
  | `${string}rem`
  | `${string}%`;

toCssUnit("20ex"); // Argument of type '"20ex"' is not assignable to parameter of type 'CSSValue'
```

아주 멋지군요! TypeScript가 정확하게 에러를 출력해줍니다. 이로써 개발 경험이 한 층 더 올라가겠네요.

### 요약
- TypeScript에서 `string` 타입을 좁히는 것이 개발 경험에 매우 중요합니다.
- `string` 타입 보다는 **String Literal**이라고 하는 유니온 타입을 사용합시다.
- TypeScript 4.1에서 지원하는 **Template Literal Type**을 사용합시다.