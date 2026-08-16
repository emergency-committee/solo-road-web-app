/** solo_road_server의 공통 페이지네이션 응답 래퍼(PageResponse&lt;T&gt;). */
export interface PageResponse<T> {
  content: T[]
  page: number | null
  size: number | null
  totalElements: number | null
  hasNext: boolean | null
}
