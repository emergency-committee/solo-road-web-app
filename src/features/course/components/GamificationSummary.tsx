import { Link } from '@tanstack/react-router'
import { Award, ChevronRight, Trophy } from 'lucide-react'
import { useMyGamification } from '../hooks/use-course-community'

export function GamificationSummary() {
  const profileQuery = useMyGamification()
  const profile = profileQuery.data

  if (profileQuery.isError) return null

  const currentFloor =
    profile?.level === 1 ? 0 : ([0, 0, 100, 300, 700, 1500][profile?.level ?? 1] ?? 0)
  const next = profile?.nextLevelExperiencePoint
  const progress =
    profile && next
      ? Math.min(100, ((profile.experiencePoint - currentFloor) / (next - currentFloor)) * 100)
      : 100

  return (
    <section className="bg-primary text-on-primary mb-xl rounded-lg p-5 shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-on-primary/15 grid size-11 shrink-0 place-items-center rounded-full">
            <Award className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs opacity-80">나의 혼행 레벨</p>
            <p className="truncate text-lg font-bold">
              Lv.{profile?.level ?? 1} {profile?.levelName ?? '여행의 첫발'}
            </p>
            <p className="truncate text-xs opacity-85">
              {profile?.equippedTitleName ?? '첫 칭호를 획득해 보세요'}
            </p>
          </div>
        </div>
        <span className="text-xs opacity-80">{profile?.experiencePoint ?? 0} XP</span>
      </div>
      <div className="mt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-black/15">
          <div
            className="h-full rounded-full bg-white transition-[width]"
            style={{ width: `${progress.toString()}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] opacity-80">
          {profile
            ? `${profile.experiencePoint.toString()} XP${next ? ` / ${next.toString()} XP` : ''}`
            : '불러오는 중...'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 border-t border-white/20 pt-3">
        <Link
          to="/my/titles"
          className="flex h-10 items-center justify-center gap-1.5 border-r border-white/20 text-sm font-semibold"
        >
          <Award className="size-4" />
          내 칭호
          <ChevronRight className="size-4" />
        </Link>
        <Link
          to="/my/ranking"
          className="flex h-10 items-center justify-center gap-1.5 text-sm font-semibold"
        >
          <Trophy className="size-4" />
          여행자 랭킹
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
