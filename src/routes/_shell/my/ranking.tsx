import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Copy, Heart, Map, Trophy } from 'lucide-react'
import { useLayoutEffect } from 'react'
import { useTravelerRanking } from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'

export const Route = createFileRoute('/_shell/my/ranking')({ component: TravelerRankingPage })

function TravelerRankingPage() {
  const navigate = useNavigate()
  const rankingQuery = useTravelerRanking()
  const travelers = rankingQuery.data?.content ?? []

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="px-margin-mobile mx-auto min-h-screen max-w-2xl pb-10">
      <header className="py-md flex items-center gap-3">
        <button
          type="button"
          aria-label="이전 화면"
          onClick={() => void navigate({ to: '/my' })}
          className="hover:bg-surface-container grid size-10 place-items-center rounded-full"
        >
          <ArrowLeft className="text-primary size-6" />
        </button>
        <div>
          <h1 className="text-on-surface text-xl font-bold">여행자 랭킹</h1>
          <p className="text-on-surface-variant text-sm">혼행의 영감을 나눈 여행자들이에요.</p>
        </div>
      </header>

      <div className="bg-primary-container text-on-primary-container mb-5 flex items-start gap-3 rounded-lg p-4">
        <Trophy className="mt-0.5 size-5 shrink-0" />
        <p className="text-sm leading-relaxed break-keep">
          여행 기록으로 얻은 XP를 기준으로 정렬하며, 동점이면 공개 코스와 받은 좋아요를
          반영해요.
        </p>
      </div>

      {rankingQuery.isLoading ? (
        <p className="text-on-surface-variant py-16 text-center text-sm">
          여행자들을 만나고 있어요...
        </p>
      ) : rankingQuery.isError ? (
        <EmptyState icon={<Trophy className="size-6" />} title="랭킹을 불러오지 못했어요" />
      ) : travelers.length === 0 ? (
        <EmptyState
          icon={<Map className="size-6" />}
          title="아직 랭킹에 오른 여행자가 없어요"
          description="공개 코스를 나누면 첫 번째 여행자가 될 수 있어요."
        />
      ) : (
        <div className="space-y-3">
          {travelers.map((traveler) => (
            <Link
              key={traveler.userId}
              to="/travelers/$travelerId"
              params={{ travelerId: traveler.userId.toString() }}
              className={`border-outline-variant/40 flex min-h-24 items-center gap-3 rounded-lg border p-4 transition-transform active:scale-[0.99] ${traveler.me ? 'border-primary bg-primary/5' : 'bg-surface'}`}
            >
              <div
                className={`grid size-9 shrink-0 place-items-center rounded-full font-bold ${traveler.ranking <= 3 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}
              >
                {traveler.ranking}
              </div>
              <img
                src={
                  traveler.profileImageUrl ??
                  `https://picsum.photos/seed/traveler-${traveler.userId.toString()}/120/120`
                }
                alt={`${traveler.nickname} 프로필`}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold">{traveler.nickname}</p>
                  {traveler.me && (
                    <span className="bg-primary text-on-primary rounded px-1.5 py-0.5 text-[10px]">
                      나
                    </span>
                  )}
                </div>
                <p className="text-primary mt-0.5 truncate text-xs font-semibold">
                  Lv.{traveler.level} {traveler.equippedTitleName ?? traveler.levelName}
                </p>
                <div className="text-on-surface-variant mt-2 flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Map className="size-3.5" /> {traveler.publicCourseCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" /> {traveler.receivedLikeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Copy className="size-3.5" /> {traveler.receivedCopyCount}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-primary text-sm font-bold">{traveler.experiencePoint} XP</p>
                <p className="text-on-surface-variant mt-1 text-[10px]">공개 코스 보기</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
