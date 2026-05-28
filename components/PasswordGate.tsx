"use client"

import { useState } from "react"

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState("")
  const [checking, setChecking] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setChecking(true)
    setError("")

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      setUnlocked(true)
    } else {
      setError("Wrong password.")
      setPassword("")
    }
    setChecking(false)
  }

  if (unlocked) return <>{children}</>

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#f7f9f5", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-sm">
        <div className="h-1 bg-[#3d6b35]" />
        <div className="p-8">
          <div className="text-center mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4 font-bold"
              style={{ backgroundColor: "#3d6b35" }}
            >
              M
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-wide">METABELLY</h1>
            <p className="text-sm text-gray-400 mt-1">AI Onboarding · Agency Access</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Session password"
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#3d6b35" } as React.CSSProperties}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={checking || !password}
              className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "#3d6b35" }}
            >
              {checking ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400">Secured · credentials are never stored</p>
    </div>
  )
}
