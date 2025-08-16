import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ts = new Date().toISOString()
    const logPath = path.resolve(process.cwd(), 'XLOGS', 'client-errors.log')
    const line = `${ts} ${JSON.stringify(body)}\n`
    fs.appendFileSync(logPath, line, 'utf8')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
