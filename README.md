1. App Router 에서 Redux 상태 관리.
- layout.tsx 는 서버 컴포넌트로 동작하며, 서버 컴포넌트에서는 클라이언트 전용 Redux Store 를 직접 사용할 수 없습니다.
- Reudx 상태 관리는 클라이언트 컴포넌트로 위임해야합니다.

2. ReduxProvider 로 상태전달
- Redux store 는 Provider 를 통해 관리하며, 클라이언트 전용 컴포넌트에서만 사용해야 합니다. 



Next.js 15 버전에서의 Redux 
클라이언트 컴포넌트에서만 Redux 사용

Next.js에서 ReduxProvider를 클라이언트 전용 컴포넌트로 만들어야 합니다.
SSR을 무시하도록 설정

Redux와 같은 클라이언트 전용 상태 관리를 사용하는 경우, 서버에서 프리렌더링하지 않도록 구성해야 합니다.


next-redux-wrapper -> wrapper.useWrappedStore() 
이건 서버 사이드 렌더링 시 특별한 처리로직으로 마운트 에러를 유발함 