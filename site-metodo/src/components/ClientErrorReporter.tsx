"use client"

import { useEffect } from 'react'

export default function ClientErrorReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const send = async (payload: any) => {
      try {
        await fetch('/api/log-client-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch (e) {
        // avoid throwing in the error handler
        // eslint-disable-next-line no-console
        console.error('[ClientErrorReporter] failed to send', e)
      }
    }

    const onErr = (e: ErrorEvent) => {
      send({ type: 'error', message: e.message, stack: e.error?.stack || null, filename: e.filename, lineno: e.lineno, colno: e.colno })
    }
    const onRej = (e: PromiseRejectionEvent) => {
      send({ type: 'unhandledrejection', reason: e.reason ? (e.reason.stack || String(e.reason)) : null })
    }

    window.addEventListener('error', onErr)
    window.addEventListener('unhandledrejection', onRej)

    return () => {
      window.removeEventListener('error', onErr)
      window.removeEventListener('unhandledrejection', onRej)
    }
  }, [])

  return null
}
