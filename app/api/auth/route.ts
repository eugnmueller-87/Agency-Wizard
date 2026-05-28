import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.WIZARD_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: "No password configured" }, { status: 500 })
  }

  if (password !== correct) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
