import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ts = new Date().toISOString()
    const logDir = path.resolve(process.cwd(), 'XLOGS')
    try { fs.mkdirSync(logDir, { recursive: true }) } catch (e) { /* ignore */ }
    const logPath = path.resolve(logDir, 'client-errors.log')

    // try to capture client-provided hints
    const headers = Object.fromEntries(req.headers.entries())
    const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown'

    const entry = {
      ts,
      ip,
      headers: {
        referer: headers.referer || headers.origin || null,
        userAgent: headers['user-agent'] || null,
      },
      body,
    }

    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf8')
    return NextResponse.json({ ok: true })
  } catch (_err) {
    return NextResponse.json({ ok: false, error: String(_err) }, { status: 500 })
  }
}
