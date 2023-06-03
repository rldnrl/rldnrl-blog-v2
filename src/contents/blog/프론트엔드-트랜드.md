---
title: 프론트엔드 트랜드
date: '2021-12-26'
tags: ['FrontEnd']
draft: false
summary: 2021년에 있었던 일들을 한 번 알아보면서 트랜드를 알아봅시다.
---

올해도 많은 일들이 있었습니다. 많이 라이브러리들이 나왔고 버전업이 된 것도 있습니다. 그 중에 제가 주목한 두 개를 통해 요즘 프론트엔드 트랜드가 어떤 건지 말해보고자 합니다. 

제가 생각하는 요즘 프론트엔드의 트랜드는 **빌드 속도**와 **정적 타이핑**인 것 같습니다. 

### 첫 번째로 빌드 속도인데요, 그와 관련된 라이브러리가 어떤 것들이 있는지 봅시다.

- [Next.js 12](https://nextjs.org/blog/next-12)
- [TurboRepo](https://github.com/vercel/turborepo)

둘 다 속도를 중점적으로 말하고 있습니다. 좀 신기한 건 JavaScript가 아닌 다른 언어로 Transpile을 해준다는 것입니다. Next.js 12는 [SWC](https://github.com/swc-project/swc)를 이용합니다. 이것은 Rust로 만들어졌습니다.

두 번째로 TurboRepo는 MonoRepo를 구축하기 쉽게 하고 빠르게 빌드할 수 있도록 합니다. 파일을 전체적으로 탐색한 후, 바뀐 부분만 빌드를 한다는 개념인데요, 이런 라이브러리가 기존에 있었습니다.([Nrwl/Nx](https://github.com/nrwl/nx) 라이브러리)

빌드 속도에 대해서 솔루션을 제시해줬으니, 개발에만 신경 쓰면 될 것 같네요. 저도 언제가는 개발자가 개발에만 신경 쓸 수 있도록 하는 라이브러리를 만들어보고 싶네요.

### 두 번째로는 속도와 정적 시스템을 둘 다 갖고 있는 [ReScript](https://rescript-lang.org/) 입니다.

소개 페이지는 다음과 같이 말하고 있습니다.

> Fast, Simple, Fully Typed JavaScript from the Future.

> ReScript looks like JS, acts like JS, and compiles to the highest quality of clean, readable and performant JS, directly runnable in browsers and Node.

저는 "compiles to the highest quality of clean, readable and performant JS..." 이 부분에 집중을 했습니다. 'JavaScript 성능이 그렇게 높지가 않은 걸까?'라는 생각을 했습니다. ReScript에 대해서 전부 다 아는 것 아니지만, ReScript에 대한 첫 인상이 사용할 수 있는 자원이 한정되어있다는 것이었습니다. 저는 이 부분이 장점으로 생각이 되는데요. 너무 많은 것을 제공을 하게 되면 개발자 개인의 역량이 많이 필요할 것입니다(제공해주는 게 너무 많으면 하나씩 알아가는 즐거움도 있습니다.). 또한, 개발자 개인에 따라 개발하는 스타일이 달라질 것입니다. 그러면 팀내부의 컨벤션을 만들어야겠네요. 이것 또한 비용일 수 있다고 생각합니다. 그래서 최적화와 적은 컨벤션, 읽기 좋은 코드를 생각해야한다면 한정된 자원이 나을 수도 있겠다는 생각이 들었습니다.

정적 타이핑 관련해서 다음과 같이 말하고 있습니다.

> Leverage the full power of JavaScript in a robustly typed language without the fear of `any` types.

JavaScript 개발자라면 누구나 Any의 두려움을 알고 있을 것입니다. 운영 배포가 되고 에러가 발생했는데, "어디서 발생한 거지...?", "무슨 말을 하는 거지...?" 하는 경험을요. 감사하게도 MS에서는 TypeScript라는 정적 타이핑을 할 수 있는 JavaScript SuperSet 언어를 만들어줬습니다. 하지만 TypeScript를 좋아하는 사람들에게는 타입을 정의하는 게 재밌을텐데, 그렇지 않은 사람들은 조금 고통일 것이라고 생각합니다. TypeScript는 타입에 대한 다양성을 많이 열어두었습니다. 타입이 재귀적으로 동작하고, 조건부 타입을 사용할 수 있는 등등 TypeScript로 만들 수 있는 게 너무 많습니다. 외국 개발자분들의 TypeScript 라이브러리를 가보면 Any가 정말 많습니다. 이런 어려움 때문에 ReScript에서는 한정된 타입만 사용할 수 있도록 한 게 아닌가 싶네요.

또한 재밌는 사실은 ReScript는 ML 계열의 언어라고 합니다. 메타(전 페이스북)는 이런 시도를 했었습니다. [Flow](https://github.com/facebook/flow)라는 정적 타이핑 툴이 OCaml로 만들어졌습니다. OCaml은 함수형 프로그래밍 언어라고 합니다. 프론트엔드 생태계를 함수형으로 밀고 있는 게 보이네요. 그래서 저도 TypeScript로 함수형 하는 방법을 공부하고 있습니다.

## 마무리
올해 이런 것들을 보면서 개발자들이 빌드와 세팅 때문에 시간을 많이 잡아먹는다는 사실을 알았습니다. 앞으로는 이런 툴들이 많이 나와서 개발자들이 개발에만 집중할 수 있는 시대가 오겠네요. 미래에는 정말 ReScript가 차지할까요? 그렇게 생각하지는 않습니다. JavaScript와 TypeScript로 만들어진 것들을 ReScript로 바꿔놔야하니까요(물론 작업은 진행 중 입니다). 언어를 잘 만드는 MS가 ReScript를 아주 쉽게 사용할 수 있게 언어를 만든다면 또 다른 얘기일 수도 있겠네요.
