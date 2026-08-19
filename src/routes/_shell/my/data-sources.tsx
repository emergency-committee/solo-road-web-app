import { createFileRoute } from '@tanstack/react-router'
import {
  Copyright,
  Database,
  ExternalLink,
  LampDesk,
  Lightbulb,
  MapPinned,
  ShieldCheck,
  Video,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/data-sources')({
  component: DataSourcesPage,
})

interface SourceItem {
  name: string
  provider: string
  coverage: string
  referenceDate: string
  usage: string
  url: string
}

const SECURITY_LIGHT_SOURCES: SourceItem[] = [
  {
    name: '전국보안등정보표준데이터',
    provider: '지방자치단체 · 공공데이터포털',
    coverage: '서울·부산·제주',
    referenceDate: '원본 행별 데이터기준일자',
    usage: '좌표가 없는 행을 제외하고 위치 중복을 정제해 보안등 위치 근거로 사용합니다.',
    url: 'https://www.data.go.kr/data/15017320/standard.do',
  },
]

const STREET_LIGHT_SOURCES: SourceItem[] = [
  {
    name: '서울시 가로등 위치 정보',
    provider: '서울특별시 · 서울 열린데이터광장',
    coverage: '서울',
    referenceDate: '2023-12-21',
    usage: '관리번호와 좌표를 정제해 가로등 위치 근거로 사용합니다.',
    url: 'https://data.seoul.go.kr/dataList/OA-22205/F/1/datasetView.do',
  },
  {
    name: '제주특별자치도 제주시 가로등현황',
    provider: '제주특별자치도 제주시 · 공공데이터포털',
    coverage: '제주시',
    referenceDate: '2024-10-10',
    usage: '가로등과 보안등이 섞인 원본에서 가로등만 분리해 사용합니다.',
    url: 'https://www.data.go.kr/data/15129786/fileData.do',
  },
  {
    name: '제주특별자치도 서귀포시 가로등 보안등 현황',
    provider: '제주특별자치도 서귀포시 · 공공데이터포털',
    coverage: '서귀포시',
    referenceDate: '2025-07-25',
    usage: '등종류가 가로등인 행만 분리해 사용합니다.',
    url: 'https://www.data.go.kr/data/15129941/fileData.do',
  },
]

const CCTV_SOURCES: SourceItem[] = [
  {
    name: '전국CCTV표준데이터',
    provider: '지방자치단체 · 공공데이터포털',
    coverage: '서울·부산·제주',
    referenceDate: '원본 행별 데이터기준일자',
    usage: '좌표 오류를 정제하고 설치 목적이 방범 또는 범죄 예방인 CCTV만 경로 점수에 사용합니다.',
    url: 'https://www.data.go.kr/data/15013094/standard.do?recommendDataYn=Y',
  },
]

const POLICE_SOURCES: SourceItem[] = [
  {
    name: '전국 경찰서 명칭 및 주소',
    provider: '경찰청 · 공공데이터포털',
    coverage: '서울·부산·제주 경찰서',
    referenceDate: '2023-06-27',
    usage: '원본 주소를 카카오 로컬 API로 좌표 변환해 경찰시설 접근 근거로 사용합니다.',
    url: 'https://www.data.go.kr/data/15124966/fileData.do',
  },
  {
    name: '전국 지구대 파출소 주소 현황',
    provider: '경찰청 · 공공데이터포털',
    coverage: '서울·부산·제주 지구대·파출소',
    referenceDate: '2025-12-31',
    usage: '원본 주소를 카카오 로컬 API로 좌표 변환해 경찰시설 접근 근거로 사용합니다.',
    url: 'https://www.data.go.kr/data/15077036/fileData.do',
  },
]

function DataSourcesPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      <TopAppBar title="데이터 출처" showBack />
      <main className="px-margin-mobile pt-md mx-auto max-w-2xl">
        <div className="mb-xl">
          <Database className="text-primary mb-sm size-8" />
          <h2 className="text-headline-lg-mobile font-bold">안심경로 데이터 안내</h2>
          <p className="text-body-sm text-on-surface-variant mt-xs leading-5">
            안심점수에 사용한 데이터의 제공기관과 기준일을 공개합니다. 각 카드에서 원본 페이지도
            확인할 수 있어요.
          </p>
        </div>

        <SourceSection
          icon={<Lightbulb className="size-5" />}
          title="보안등"
          description="주택가와 골목의 보행 조명 위치를 판단합니다."
          sources={SECURITY_LIGHT_SOURCES}
        />
        <SourceSection
          icon={<LampDesk className="size-5" />}
          title="가로등"
          description="도로 주변의 조명 위치를 판단합니다."
          sources={STREET_LIGHT_SOURCES}
          notice="부산은 시 전체를 대표하는 공식 좌표 기반 가로등 데이터를 확보하지 못해 현재 가로등 점수에 반영하지 않습니다."
        />
        <SourceSection
          icon={<Video className="size-5" />}
          title="방범 CCTV"
          description="방범 또는 범죄 예방 목적으로 설치된 CCTV 위치를 판단합니다."
          sources={CCTV_SOURCES}
        />
        <SourceSection
          icon={<ShieldCheck className="size-5" />}
          title="경찰시설"
          description="경찰서, 지구대, 파출소와 경로 사이의 접근 거리를 판단합니다."
          sources={POLICE_SOURCES}
        />
        <SourceSection
          icon={<MapPinned className="size-5" />}
          title="지도와 도보 경로"
          description="지도 표시와 큰길 우선 도보 경로 조회에는 카카오맵 API를 사용합니다."
          sources={[
            {
              name: '카카오맵 API',
              provider: 'Kakao',
              coverage: '지도 표시 · 도보 경로',
              referenceDate: 'API 조회 시점',
              usage:
                '큰길 우선 도보 경로를 조회하고, 안전시설 근거를 반영한 경유 경로와 비교합니다.',
              url: 'https://developers.kakao.com/docs/ko/kakaomap/common',
            },
          ]}
        />

        <section className="border-outline-variant/50 mb-xl pt-md border-t">
          <div className="mb-sm flex items-start gap-3">
            <span className="bg-primary-fixed text-primary grid size-9 shrink-0 place-items-center rounded-[8px]">
              <Copyright className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-bold">출처 표기 원칙</h3>
              <p className="text-body-sm text-on-surface-variant mt-0.5 leading-5">
                데이터명, 제공기관, 기준일, 원본 링크를 함께 표시합니다. 원본 데이터는 다운로드나
                조회 API로 재제공하지 않습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function SourceSection({
  icon,
  title,
  description,
  sources,
  notice,
  warning,
}: {
  icon: ReactNode
  title: string
  description: string
  sources: SourceItem[]
  notice?: string
  warning?: string
}) {
  return (
    <section className="border-outline-variant/50 mb-xl pt-md border-t">
      <div className="mb-sm flex items-start gap-3">
        <span className="bg-primary-fixed text-primary grid size-9 shrink-0 place-items-center rounded-[8px]">
          {icon}
        </span>
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5 leading-5">{description}</p>
        </div>
      </div>

      <div className="space-y-sm">
        {sources.map((source) => (
          <SourceCard key={source.name} source={source} />
        ))}
      </div>

      {notice && (
        <p className="bg-surface-container text-on-surface-variant mt-sm rounded-[8px] px-3 py-2.5 text-xs leading-5">
          {notice}
        </p>
      )}
      {warning && (
        <p className="bg-error-container/60 text-on-error-container mt-sm rounded-[8px] px-3 py-2.5 text-xs leading-5">
          {warning}
        </p>
      )}
    </section>
  )
}

function SourceCard({ source }: { source: SourceItem }) {
  return (
    <article className="border-outline-variant/60 rounded-[8px] border bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-bold break-keep">{source.name}</h4>
          <p className="text-on-surface-variant mt-0.5 text-xs">{source.provider}</p>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${source.name} 원본 페이지 열기`}
          className="text-primary hover:bg-primary-fixed grid size-9 shrink-0 place-items-center rounded-full"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>
      <dl className="mt-sm grid grid-cols-[76px_1fr] gap-x-2 gap-y-1.5 text-xs leading-5">
        <dt className="text-outline">데이터 범위</dt>
        <dd>{source.coverage}</dd>
        <dt className="text-outline">기준일</dt>
        <dd>{source.referenceDate}</dd>
        <dt className="text-outline">활용 방식</dt>
        <dd>{source.usage}</dd>
      </dl>
    </article>
  )
}
