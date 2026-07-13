# 솔로더 (SoloRoad)

혼자 여행하는 사람을 위한 AI 여행지 추천 + 코스 생성 PWA입니다.

## 기술 스택

Vite 8 · React 19 · TypeScript(strict) · TanStack Router · TanStack Query · Zustand · Tailwind CSS v4 · shadcn/ui · vite-plugin-pwa

## 시작하기

```bash
npm install
cp .env.example .env.local   # VITE_API_KEY 등 값 채우기
npm run dev                  # http://localhost:5173
```

백엔드(`solo-road-ai-server`, FastAPI)가 `http://localhost:8000`에서 실행 중이어야 API 연동 화면이 정상 동작합니다. 개발 서버는 `/api` 요청을 자동으로 프록시합니다.

## 사용 가능한 명령어

```bash
npm run dev           # 개발 서버
npm run build          # 프로덕션 빌드 (tsc + vite build)
npm run preview        # 빌드 결과물 미리보기
npm run test           # Vitest 단위 테스트
npm run lint           # oxlint
npm run format         # Prettier 포맷 적용
npm run format:check   # Prettier 포맷 검사
```

## 더 알아보기

- [`CLAUDE.md`](./CLAUDE.md) — 폴더 구조, 네이밍 컨벤션, API 연동 방식 등 프로젝트 상세 가이드
- [`DESIGN.md`](./DESIGN.md) — 색상·타이포그래피·spacing 등 디자인 시스템 토큰
