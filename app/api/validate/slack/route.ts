import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token?.startsWith("xoxb-")) {
    return NextResponse.json({ error: "Token should start with xoxb-" }, { status: 400 })
  }

  try {
    const res = await fetch("https://slack.com/api/auth.test", {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()

    if (!data.ok) {
      return NextResponse.json({ error: data.error ?? "Invalid Slack token" }, { status: 400 })
    }

    return NextResponse.json({ ok: true, team: data.team })
  } catch {
    return NextResponse.json({ error: "Could not reach Slack API" }, { status: 500 })
  }
}
