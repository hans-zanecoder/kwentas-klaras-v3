export interface ErrorHandlerOptions {
  defaultMessage?: string
  logError?: boolean
  onError?: (error: Error) => void
}

