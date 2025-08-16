import { AsyncLocalStorage } from 'async_hooks'

interface RequestContextStore {
  correlationId: string
}

export const requestContext = new AsyncLocalStorage<RequestContextStore>()

export function getCorrelationId(): string | undefined {
  return requestContext.getStore()?.correlationId
}

export function withRequestContext<T>(correlationId: string, fn: () => T): T {
  return requestContext.run({ correlationId }, fn)
}
