export interface ServerError {
  log: string
  status: number
  message: {
    error: string
  }
}

export interface ClientData {
  [field: string]: any
}