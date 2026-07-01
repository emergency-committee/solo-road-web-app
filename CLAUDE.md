# SoloRoad Web App — CLAUDE.md

> AI 에이전트(Claude Code)가 프로젝트를 즉시 파악하기 위한 문서입니다.

## 프로젝트 개요

**솔로더(SoloRoad)** — 혼자 여행하는 사람을 위한 AI 여행지 추천 + 코스 생성 PWA.

## 기술 스택

| 레이어 | 기술 |
|---|---|
| 빌드 | Vite 8 + `@tailwindcss/vite` |
| UI 프레임워크 | React 19 + TypeScript 6 (strict) |
| 라우팅 | TanStack Router v1 (파일 기반, `src/routes/`) |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand v5 |
| 스타일 | Tailwind CSS v4 + shadcn/ui new-york |
| PWA | vite-plugin-pwa (Workbox autoUpdate) |
| 코드 품질 | oxlint + Prettier |

## 백엔드 API

레포: `solo-road-ai-server` (FastAPI, 포트 8000)

개발 환경에서는 Vite 프록시가 `/api` → `http://localhost:8000`으로 전달합니다.

| 엔드포인트 | 방식 | 설명 |
|---|---|---|
| `POST /api/v1/recommend` | JSON 응답 | 여행지 추천 |
| `POST /api/v1/course` | **SSE 스트리밍** | 코스 생성 |
| `GET /api/v1/health` | JSON | 헬스체크 |

모든 요청에 `X-API-Key: $VITE_API_KEY` 헤더 필수.

**SSE 이벤트 형식** (`/api/v1/course`):
```
event: message
data: {"content": "...", "done": false}

event: done
data: {"done": true}

event: error
data: {"error": "메시지"}
```

## 폴더 구조

```
src/
├── app/                    # 전역 설정
│   ├── providers.tsx       # QueryClientProvider 트리
│   ├── query-client.ts     # TanStack Query 싱글턴
│   └── router.ts           # createRouter (routeTree.gen 임포트)
├── features/               # 도메인 슬라이스
│   ├── recommend/          # 여행지 추천 기능
│   │   ├── api/            # fetch 호출 (apiRequest 래퍼)
│   │   ├── components/     # UI 컴포넌트
│   │   ├── hooks/          # useMutation 기반 훅
│   │   ├── types/          # TypeScript 타입
│   │   └── index.ts        # 외부 공개 barrel export
│   └── course/             # AI 코스 생성 기능
│       ├── api/            # SSE fetch 호출
│       ├── components/
│       ├── hooks/          # useCourseStream (AbortController + SSE)
│       ├── store/          # Zustand (스트리밍 상태)
│       ├── types/
│       └── index.ts
├── shared/                 # 도메인 무관 공유 레이어
│   ├── api/
│   │   ├── client.ts       # apiRequest<T>() — fetch 래퍼 + X-API-Key
│   │   ├── sse-client.ts   # fetchSSE() — ReadableStream SSE 파서
│   │   └── errors.ts       # ApiError 클래스
│   ├── components/ui/      # shadcn/ui 컴포넌트 (자동 생성)
│   ├── hooks/              # use-pwa-install, use-online-status
│   └── lib/utils.ts        # cn() = clsx + tailwind-merge
├── routes/                 # TanStack Router 파일 기반 라우트
│   ├── __root.tsx          # 루트 레이아웃
│   ├── index.tsx           # /
│   ├── recommend/index.tsx # /recommend
│   └── course/index.tsx    # /course
├── styles/globals.css      # @import "tailwindcss"
├── main.tsx                # 앱 진입점
└── routeTree.gen.ts        # ⚠ 자동 생성 — 직접 수정 금지
```

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 파일 (일반) | `kebab-case.ts` | `recommend-api.ts` |
| 파일 (컴포넌트) | `PascalCase.tsx` | `PlaceCard.tsx` |
| 훅 파일 | `use-kebab-case.ts` | `use-recommend.ts` |
| 훅 함수 | `useCamelCase` | `useRecommend` |
| 타입 파일 | `[name].types.ts` | `course.types.ts` |
| 외부 공개 | feature `index.ts`만 | `import { useRecommend } from '@/features/recommend'` |

## 환경변수

```bash
# .env.local (커밋 제외)
VITE_API_BASE_URL=   # 빈 문자열 = 프록시(/api) 사용
VITE_API_KEY=        # X-API-Key 인증값
```

⚠ `VITE_` 접두사 변수는 클라이언트 번들에 포함됩니다. API 키는 개발 전용입니다.

## 개발 명령어

```bash
npm run dev           # 개발 서버 http://localhost:5173
npm run build         # 프로덕션 빌드 (tsc + vite build)
npm run preview       # 빌드 결과물 미리보기
npm run test          # Vitest 단위 테스트
npm run lint          # oxlint
npm run format        # Prettier 포맷 적용
npm run format:check  # Prettier 포맷 검사
```

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]
```

생성 경로: `src/shared/components/ui/`

## 주의사항

- `routeTree.gen.ts` — 직접 수정 금지. 새 라우트는 `src/routes/`에 파일 생성.
- SSE 스트림 — 컴포넌트 unmount 시 반드시 `abort()` 호출 (`useCourseStream` 참고).
- Zustand 스토어 — 전역 단일 스토어 지양. feature 내부 `store/` 폴더에 위치.
- `exactOptionalPropertyTypes: true` — 옵셔널 프로퍼티에 `undefined` 명시 필요.
- `noUncheckedIndexedAccess: true` — 배열 인덱스 접근 시 `undefined` 체크 필요.
