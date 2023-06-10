---
title: HOC vs Hooks
date: '2022-05-13'
tags: ["React"]
draft: true
summary: High-Order Component와 Hooks에 대해서 알아봅시다.
---

## High-Order Component 패턴

> High-Order Component란?<br />
> Component를 인자로 하고, 새로운 컴포넌트를 반환하는 함수입니다.

### 왜 사용할까요?

High-Order Component는 기존 컴포넌트를 확장하고 재사용하기 위한 패턴입니다.

- 중복을 없앰.
- 컴포넌트를 향상시키고, 다른 목적으로 사용할 수 있도록 함.

### 실전 예제

- `MovieListWithHOC`: 이름, 표지 이미지, 감독 이름 등과 같은 영화 정보를 나열하는 컴포넌트
- `MovieAnalyticsWithHOC`: 영화 데이터에 대한 분석을 보여주는 컴포넌트

이러한 컴포넌트는 데이터베이스에서 데이터를 가져오는 것과 같은 요구 사항이 있습니다. 응답으로 영화 데이터를 가져오도록 요청할 수 있는 API(URI: https://json-faker.onrender.com/movies)가 있다고 가정해 보겠습니다.

API를 사용하여 영화 데이터를 가져오는 로직은 두 컴포넌트에 공통적으로 필요합니다. 그러나 잠깐, 우리는 두 컴포넌트에서 데이터 가져오기 로직을 반복하고 싶지 않습니다. 대신, HOC 패턴을 사용하여 가져오기 로직을 재사용하고 컴포넌트를 향상시킵니다.

먼저 영화 데이터 가져오기 로직을 ​​사용하여 HOC를 생성해 보겠습니다.

```jsx
import React from "react";

// Craete a HOC that takes a component as an argument
const withFetch = (WrappedComponent) => {
    
  // Create a Class Component that will
  // enhance the WrappedComponent 
  class WithFetch extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        movies: [],
      };
    }

    componentDidMount() {
      // Fetch the movie data by making an API call  
      fetch("https://json-faker.onrender.com/movies")
        .then((response) => response.json())
        .then((data) => {
          this.setState({ movies: data.movies });
        });
    }

    render() {
      return (
        <>
          {this.state.movies.length > 0 && (
            <WrappedComponent movies={this.state.movies} />
          )}
        </>
      );
    }
  };
  
  // It is optional to set the display name of the
  // component but useful when comes to debug the HOC.
  WithFetch.displayName = `WithFetch(${WithFetch.name})`;
  
  // Finally, return the component
  return WithFetch;
};

export default withFetch;
```

여기서 주의할 몇 가지 사항:

- 컴포넌트(`WrappedComponent`)를 인자로 취하는 `withFetch`를 사용하여 React 컴포넌트(일반 JavaScript 함수)를 만들었습니다.
- `withFetch` 컴포넌트는 클래스 컴포넌트를 반환합니다.
- 우리는 영화라는 상태 변수를 만들고 `componentDidMount` Life Cycle 메서드에서 API 호출의 응답을 사용하여 업데이트합니다.
- 이제 컴포넌트의 JSX 부분을 살펴봅시다. 여기에서 영화 데이터를 Props으로 전달하는 `WrappedComponent`를 향상시킵니다.
- 마지막으로 클래스 컴포넌트를 반환합니다. 이 컴포넌트의 핵심 부분은 영화 데이터로 향상된 `WrappedComponent`입니다.

이제 프레젠테이션 컴포넌트를 `withFetch` Higher-Order 컴포넌트에 전달하여 데이터와 함께 작동하는 컴포넌트를 다시 가져올 수 있기 때문에 강력합니다. 가장 좋은 점은 동일한 HOC를 사용하여 데이터를 가져오고 다르게 표현할 수 있는 여러 프리젠테이션 컴포넌트(예: 하나는 영화를 나열하고, 다른 하나는 분석을 표시하는 것)입니다.

HOC를 사용하여 영화 목록 컴포넌트를 만들어 보겠습니다.

```jsx
import MovieContainer from "../movies/MovieContainer";
import "../movies/movies.css";
import withFetch from "./MovieWrapper";

const MovieListWithHOC = (props) => {
  const { movies } = props;
  return (
    <div className="movie-container">
      <h2>Movie List - With HoC</h2>
      <MovieContainer data={movies} />
    </div>
  );
};

export default withFetch(MovieListWithHOC);
```

위의 코드에서 볼 수 있듯이 `MovieListWithHOC`는 HOC(`withFetch`)로 향상된 프레젠테이션 컴포넌트입니다.

여기에 한 번 주목해볼까요?

```jsx
export default withFetch(MovieListWithHOC);
```

따라서 `MovieListWithHOC` 컴포넌트는 영화 데이터를 Props으로 가져와 `MovieContainer`라는 다른 컴포넌트에 전달하여 데이터를 렌더링합니다.

마찬가지로 동일한 영화 데이터를 사용하여 영화 분석을 표시하기 위한 또 다른 컴포넌트를 가질 수 있습니다.

```jsx
import MovieAnalytics from "../movies/MovieAnalytics";
import "../movies/movies.css";
import withFetch from "./MovieWrapper";

const MovieAnalyticsWithHOC = (props) => {
  const { movies } = props;
  return (
    <div className="movie-container">
      <h2>Movie Analytics - With HoC</h2>
      <MovieAnalytics data={movies} />
    </div>
  );
};

export default withFetch(MovieAnalyticsWithHOC);
```

이것은 Redux, React-Router와 같은 많은 React 기반 라이브러리(React 포함)에서 이 패턴을 사용합니다.

## Hook