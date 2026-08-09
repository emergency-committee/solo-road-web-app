/** solo_road_server의 GlobalExceptionHandler가 내려주는 에러 응답 형태. */
export interface ApiErrorBody {
  status: number
  message: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    /** 응답이 JSON({status, message})으로 파싱 가능했을 때만 채워진다. */
    public readonly errorBody?: ApiErrorBody,
  ) {
    super(errorBody?.message ?? `API Error ${status.toString()}: ${body}`)
    this.name = 'ApiError'
  }
}
