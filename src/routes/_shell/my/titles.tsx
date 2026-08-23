import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Award, Check, LockKeyhole } from 'lucide-react'
import { useEquipTitle, useMyGamification } from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'

export const Route = createFileRoute('/_shell/my/titles')({ component: TitlesPage })

function TitlesPage() {
  const navigate = useNavigate()
  const profileQuery = useMyGamification()
  const equip = useEquipTitle()
  const profile = profileQuery.data

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
          <h1 className="text-xl font-bold">나의 칭호</h1>
          <p className="text-on-surface-variant text-sm">
            여행 기록이 쌓일수록 새로운 칭호가 열려요.
          </p>
        </div>
      </header>

      {profileQuery.isError ? (
        <EmptyState icon={<Award className="size-6" />} title="칭호를 불러오지 못했어요" />
      ) : (
        <>
          <section className="bg-primary text-on-primary mb-6 rounded-lg p-5">
            <p className="text-sm opacity-80">현재 레벨</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-bold">
                Lv.{profile?.level ?? 1} {profile?.levelName ?? '여행의 첫발'}
              </h2>
              <span className="text-sm">{profile?.experiencePoint ?? 0} XP</span>
            </div>
            <p className="mt-3 text-sm opacity-85">
              코스 공개 50 XP · 내 코스가 담길 때 10 XP · 받은 좋아요 2 XP · 후기 5 XP
            </p>
          </section>

          <div className="space-y-3">
            {(profile?.titles ?? []).map((title) => {
              const percent = Math.min(100, (title.progress / title.target) * 100)
              return (
                <button
                  key={title.code}
                  type="button"
                  disabled={!title.unlocked || equip.isPending}
                  onClick={() => equip.mutate(title.code)}
                  className={`border-outline-variant/40 flex w-full items-center gap-3 rounded-lg border p-4 text-left ${title.equipped ? 'border-primary bg-primary/5' : 'bg-white'} disabled:opacity-70`}
                >
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${title.unlocked ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}
                  >
                    {title.unlocked ? (
                      <Award className="size-5" />
                    ) : (
                      <LockKeyhole className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{title.name}</p>
                      {title.equipped && (
                        <span className="bg-primary text-on-primary rounded px-1.5 py-0.5 text-[10px]">
                          대표
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-xs break-keep">
                      {title.description}
                    </p>
                    {!title.unlocked && (
                      <div className="mt-2">
                        <div className="bg-surface-container h-1 overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full"
                            style={{ width: `${percent.toString()}%` }}
                          />
                        </div>
                        <p className="text-outline mt-1 text-[10px]">
                          {title.progress} / {title.target}
                        </p>
                      </div>
                    )}
                  </div>
                  {title.equipped && <Check className="text-primary size-5" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}
