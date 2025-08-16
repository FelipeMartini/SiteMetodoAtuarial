// async_hooks só existe em Node; durante o build/cliente devemos evitar importá-lo.
interface RequestContextStore {
  correlationId: string
}

let AsyncLocalStorageImpl: any = undefined
if (typeof window === 'undefined') {
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    // require here to avoid bundling async_hooks into client-side builds
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AsyncLocalStorageImpl = require('async_hooks').AsyncLocalStorage
    /* eslint-enable @typescript-eslint/no-require-imports */
  } catch (_e) {
    AsyncLocalStorageImpl = undefined
  }
}

// Fallback simples quando não houver AsyncLocalStorage (cliente/bundle)
const noopStore = {
  getStore: () => undefined,
  run: (_store: any, fn: any) => fn(),
}

export const requestContext: {
  getStore: () => RequestContextStore | undefined
  run: (store: RequestContextStore, fn: (...args: any[]) => any) => any
} = AsyncLocalStorageImpl ? new (AsyncLocalStorageImpl as any)() : (noopStore as any)

export function getCorrelationId(): string | undefined {
  return (requestContext.getStore && requestContext.getStore())?.correlationId
}

export function withRequestContext<T>(correlationId: string, fn: () => T): T {
  if (requestContext.run) {
    return requestContext.run({ correlationId }, fn)
  }
  return fn()
}
