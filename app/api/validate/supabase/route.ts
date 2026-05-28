import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { url, key } = await req.json()

  if (!url?.includes("supabase.co")) {
    return NextResponse.json({ error: "Invalid Supabase URL" }, { status: 400 })
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    if (res.status === 401) {
      return NextResponse.json({ error: "Invalid anon key" }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Could not reach Supabase project" }, { status: 500 })
  }
}
