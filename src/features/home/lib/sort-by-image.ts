/**
 * 이미지가 있는 장소를 앞으로, 없는 장소를 뒤로 보낸다.
 * Array.prototype.sort는 안정 정렬이라 같은 그룹 내 원래 순서는 유지된다.
 */
export function sortByImageFirst<T extends { hasImage: boolean }>(places: T[]): T[] {
  return [...places].sort((a, b) => Number(b.hasImage) - Number(a.hasImage))
}
