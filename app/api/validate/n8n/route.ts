import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { n8nUrl, n8nApiKey } = await req.json()

  if (!n8nUrl || !n8nApiKey) {
    return NextResponse.json({ error: "n8nUrl and n8nApiKey are required" }, { status: 400 })
  }

  const base = n8nUrl.trim().replace(/\/$/, "")

  try {
    const res = await fetch(`${base}/api/v1/workflows?limit=1`, {
      headers: { "X-N8N-API-KEY": n8nApiKey },
    })

    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ error: "API key rejected — check it and try again." }, { status: 400 })
    }

    if (!res.ok) {
      return NextResponse.json({ error: `n8n returned ${res.status}. Check the instance URL.` }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Could not reach n8n instance. Check the URL." }, { status: 500 })
  }
}
