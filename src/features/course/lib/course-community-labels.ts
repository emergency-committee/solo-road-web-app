import type { PaceType, SoloImpression } from '../types/course.types'

export const SOLO_IMPRESSION_OPTIONS: {
  value: SoloImpression
  label: string
  description: string
}[] = [
  {
    value: 'BETTER_ALONE',
    label: '혼자라서 더 좋았어요',
    description: '내 속도로 온전히 즐기기 좋아요.',
  },
  {
    value: 'COMFORTABLE_SOLO',
    label: '혼자서도 편안했어요',
    description: '혼밥이나 혼자 머무는 시간이 자연스러워요.',
  },
  {
    value: 'EASY_SOLO',
    label: '처음 혼자 가도 괜찮아요',
    description: '길 찾기와 이용 방법이 어렵지 않아요.',
  },
  {
    value: 'PREPARATION_NEEDED',
    label: '조금 준비하면 좋아요',
    description: '시간대나 예약을 미리 확인해 주세요.',
  },
  {
    value: 'BETTER_TOGETHER',
    label: '함께 가면 더 좋아요',
    description: '혼자보다는 동행이 있을 때 더 편한 코스예요.',
  },
]

export const PACE_OPTIONS: { value: PaceType; label: string }[] = [
  { value: 'RELAXED', label: '천천히 여유롭게' },
  { value: 'BALANCED', label: '알맞게 둘러보기' },
  { value: 'FULL', label: '하루를 알차게' },
]

export function soloImpressionLabel(value?: SoloImpression) {
  return SOLO_IMPRESSION_OPTIONS.find((option) => option.value === value)?.label
}

export function paceLabel(value?: PaceType) {
  return PACE_OPTIONS.find((option) => option.value === value)?.label
}
