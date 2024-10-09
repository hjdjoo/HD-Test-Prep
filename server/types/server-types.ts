export interface ServerError {
  log: string
  status: number
  message: {
    error: string
  }
}