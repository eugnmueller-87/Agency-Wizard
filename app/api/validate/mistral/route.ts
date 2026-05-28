import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { apiKey } = await req.json()

  if (!apiKey?.startsWith("sk-") && !apiKey?.startsWith("ms-")) {
    return NextResponse.json({ error: "Key should start with sk- or ms-" }, { status: 400 })
  }

  try {
    const res = await fetch("https://api.mistral.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "API key rejected by Mistral" }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Could not reach Mistral API" }, { status: 500 })
  }
}
