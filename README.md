1. App Router 에서 Redux 상태 관리.
- layout.tsx 는 서버 컴포넌트로 동작하며, 서버 컴포넌트에서는 클라이언트 전용 Redux Store 를 직접 사용할 수 없습니다.
- Reudx 상태 관리는 클라이언트 컴포넌트로 위임해야합니다.

2. ReduxProvider 로 상태전달
- Redux store 는 Provider 를 통해 관리하며, 클라이언트 전용 컴포넌트에서만 사용해야 합니다. 

3. Styled-componet 라이브러리 사용 시, next.config.js 에 설정 필수