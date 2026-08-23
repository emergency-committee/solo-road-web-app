import { useEffect, useMemo, useState } from 'react'
import { Check, Globe2 } from 'lucide-react'
import { PACE_OPTIONS, SOLO_IMPRESSION_OPTIONS } from '../lib/course-community-labels'
import { useCourseTags, usePublishCourse } from '../hooks/use-course-community'
import type { CourseDetailResponse, PaceType, SoloImpression } from '../types/course.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

export function PublishCourseDialog({
  course,
  open,
  onOpenChange,
}: {
  course: CourseDetailResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const tagsQuery = useCourseTags()
  const publish = usePublishCourse(course.courseId)
  const [description, setDescription] = useState('')
  const [soloImpression, setSoloImpression] = useState<SoloImpression | undefined>()
  const [paceType, setPaceType] = useState<PaceType | undefined>()
  const [authorComment, setAuthorComment] = useState('')
  const [tagIds, setTagIds] = useState<number[]>([])

  useEffect(() => {
    if (!open) return
    setDescription(course.description ?? '')
    setSoloImpression(course.soloImpression)
    setPaceType(course.paceType)
    setAuthorComment(course.authorComment ?? '')
    setTagIds(course.tags.map((tag) => tag.tagId))
  }, [course, open])

  const groupedTags = useMemo(() => {
    const tags = tagsQuery.data ?? []
    return {
      highlights: tags.filter((tag) => tag.category === 'HIGHLIGHT'),
      cautions: tags.filter((tag) => tag.category === 'CAUTION'),
    }
  }, [tagsQuery.data])

  function toggleTag(tagId: number, category: 'HIGHLIGHT' | 'CAUTION') {
    setTagIds((current) => {
      if (current.includes(tagId)) return current.filter((id) => id !== tagId)
      const selectedInCategory = (tagsQuery.data ?? []).filter(
        (tag) => current.includes(tag.tagId) && tag.category === category,
      ).length
      const max = category === 'HIGHLIGHT' ? 3 : 2
      return selectedInCategory >= max ? current : [...current, tagId]
    })
  }

  const valid =
    description.trim().length >= 10 && soloImpression !== undefined && paceType !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe2 className="text-primary size-5" /> 코스 공개하기
          </DialogTitle>
          <DialogDescription>
            다른 여행자가 코스를 참고하고 자신의 일정으로 가져갈 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold">어떤 코스인가요?</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="이 코스의 분위기와 추천 이유를 알려주세요."
              className="border-outline-variant focus:border-primary w-full resize-none rounded-lg border bg-white p-3 text-sm outline-none"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold">혼자 다녀보니 어땠나요?</legend>
            {SOLO_IMPRESSION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSoloImpression(option.value)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${soloImpression === option.value ? 'border-primary bg-primary/5' : 'border-outline-variant bg-white'}`}
              >
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${soloImpression === option.value ? 'border-primary bg-primary text-white' : 'border-outline'}`}
                >
                  {soloImpression === option.value && <Check className="size-3" />}
                </span>
                <span>
                  <strong className="block text-sm">{option.label}</strong>
                  <span className="text-on-surface-variant text-xs">{option.description}</span>
                </span>
              </button>
            ))}
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">일정 템포</legend>
            <div className="grid grid-cols-3 gap-2">
              {PACE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPaceType(option.value)}
                  className={`min-h-11 rounded-lg border px-2 text-xs font-semibold break-keep ${paceType === option.value ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <TagSelector
            title="좋았던 점 · 최대 3개"
            tags={groupedTags.highlights}
            selected={tagIds}
            onToggle={(id) => toggleTag(id, 'HIGHLIGHT')}
          />
          <TagSelector
            title="미리 알면 좋은 점 · 최대 2개"
            tags={groupedTags.cautions}
            selected={tagIds}
            onToggle={(id) => toggleTag(id, 'CAUTION')}
          />

          <label className="block space-y-2">
            <span className="text-sm font-semibold">
              한마디 남기기 <span className="text-on-surface-variant font-normal">(선택)</span>
            </span>
            <input
              value={authorComment}
              onChange={(event) => setAuthorComment(event.target.value)}
              maxLength={200}
              placeholder="이 코스를 따라갈 여행자에게 전하고 싶은 말"
              className="border-outline-variant focus:border-primary h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none"
            />
          </label>

          {publish.isError && (
            <p className="text-error text-sm">공개하지 못했어요. 입력 내용을 확인해 주세요.</p>
          )}

          <button
            type="button"
            disabled={!valid || publish.isPending}
            onClick={() => {
              if (!valid) return
              publish.mutate(
                {
                  description: description.trim(),
                  soloImpression,
                  paceType,
                  tagIds,
                  ...(authorComment.trim() && { authorComment: authorComment.trim() }),
                },
                { onSuccess: () => onOpenChange(false) },
              )
            }}
            className="bg-primary text-on-primary h-12 w-full rounded-lg font-bold disabled:opacity-40"
          >
            {publish.isPending
              ? '공개하는 중...'
              : course.visibility === 'PUBLIC'
                ? '공개 정보 수정하기'
                : '여행자들에게 공개하기'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TagSelector({
  title,
  tags,
  selected,
  onToggle,
}: {
  title: string
  tags: { tagId: number; name: string }[]
  selected: number[]
  onToggle: (id: number) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.tagId}
            type="button"
            onClick={() => onToggle(tag.tagId)}
            className={`rounded-full border px-3 py-2 text-xs font-medium ${selected.includes(tag.tagId) ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant bg-white'}`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
