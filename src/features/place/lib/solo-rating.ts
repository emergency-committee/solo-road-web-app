export function hasDisplayableSoloRating(
  soloRating: number | null | undefined,
  reviewCount: number,
) {
  return soloRating != null && reviewCount >= 3
}

export function soloRatingMessage(soloRating: number | null | undefined, reviewCount: number) {
  if (!hasDisplayableSoloRating(soloRating, reviewCount)) return '혼밥 평가가 모이고 있어요'
  if (soloRating! >= 4) return '혼자 식사하기 편한 곳이에요'
  if (soloRating! >= 3) return '무난하게 혼밥할 수 있어요'
  return '방문 전 혼밥 후기를 확인해 보세요'
}
