import { NextRequest, NextResponse } from "next/server"

// Activation and Slack notification are handled by /api/provision
// This endpoint is kept for backwards compatibility but delegates to provision
export async function POST(req: NextRequest) {
  const body = await req.json()
  const url = new URL("/api/provision", req.url)
  return fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (r) => {
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  })
}
