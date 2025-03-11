# ---- Step 1: Build Stage ----
	FROM node:20-alpine AS builder

	# 작업 디렉터리 설정
	WORKDIR /app
	
	# package.json과 yarn.lock 복사
	COPY package.json yarn.lock ./
	
	# Next.js 버전에 맞춰 @next/swc 설치 후 의존성 설치
	RUN yarn install --immutable --check-cache
	
	# 소스 코드 복사
	COPY . .
	
	# Next.js 캐시 삭제 (필요한 경우)
	RUN rm -rf .next/cache
	
	# Next.js 애플리케이션 빌드
	RUN yarn build
	
	# ---- Step 2: Production Stage ----
	FROM node:20-alpine AS runner
	
	# 작업 디렉터리 설정
	WORKDIR /app
	
	# 빌드된 파일을 복사
	COPY --from=builder /app/package.json /app/yarn.lock ./
	COPY --from=builder /app/.next ./.next
	COPY --from=builder /app/public ./public
	COPY --from=builder /app/node_modules ./node_modules
	
	# 환경변수 설정
	ENV NODE_ENV=production
	ENV PORT=3000
	
	# 서버 실행
	CMD ["yarn", "start"]
	