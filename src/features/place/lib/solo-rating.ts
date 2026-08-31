export function hasDisplayableSoloRating(
  soloRating: number | null | undefined,
  _reviewCount: number,
) {
  return soloRating != null
}

export function soloRatingMessage(
  soloRating: number | null | undefined,
  reviewCount: number,
  context: 'dining' | 'travel' = 'dining',
) {
  if (!hasDisplayableSoloRating(soloRating, reviewCount)) {
    return context === 'dining' ? '혼밥 적합도를 준비 중이에요' : '혼행 적합도를 준비 중이에요'
  }
  if (context === 'travel') {
    if (soloRating! >= 4) return '혼자 둘러보기 좋은 곳이에요'
    if (soloRating! >= 3) return '혼자 방문하기 무난해요'
    return '방문 전 혼행 후기를 확인해 보세요'
  }
  if (soloRating! >= 4) return '혼자 식사하기 편한 곳이에요'
  if (soloRating! >= 3) return '무난하게 혼밥할 수 있어요'
  return '방문 전 혼밥 후기를 확인해 보세요'
}
