export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`API Error ${status.toString()}: ${body}`)
    this.name = 'ApiError'
  }
}
