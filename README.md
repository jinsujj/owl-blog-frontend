1. App Router 에서 Redux 상태 관리.
- layout.tsx 는 서버 컴포넌트로 동작하며, 서버 컴포넌트에서는 클라이언트 전용 Redux Store 를 직접 사용할 수 없습니다.
- Reudx 상태 관리는 클라이언트 컴포넌트로 위임해야합니다.

2. ReduxProvider 로 상태전달
- Redux store 는 Provider 를 통해 관리하며, 클라이언트 전용 컴포넌트에서만 사용해야 합니다. 

3. Styled-componet 라이브러리 사용 시, next.config.js 에 설정 필수


### 개발환경 HTTPS 

https 프론트, 백엔드 실행 
- caddy reverse-proxy --from localhost:3030 --to localhost:3000
- caddy reverse-proxy --from localhost:8081 --to localhost:8080

백엔드 application.yml 설정 
- redirect-uri: https://localhost:3030

카카오 개발 페이지 Redirect Page 설정
- https://localhost:3030

프론트에서 백엔드 리다이렉트 설정 
- NEXT_PUBLIC_BACKEND_URI=https://localhost:8081