"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepSlack({ config, collected, onComplete }: StepProps) {
  const [token, setToken] = useState(collected.slack_bot_token || "")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    collected.slack_bot_token ? "success" : "idle"
  )
  const [error, setError] = useState("")

  async function validate() {
    if (!token.trim()) return
    setStatus("loading")
    setError("")

    const res = await fetch("/api/validate/slack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })

    if (res.ok) {
      setStatus("success")
      setTimeout(() => onComplete({ slack_bot_token: token }), 800)
    } else {
      const data = await res.json()
      setStatus("error")
      setError(data.error ?? "Invalid token")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">💬</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Slack</h2>
          <p className="text-sm text-gray-500">Where your team receives triage notifications in real time</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        Every classified message gets routed to a dedicated Slack channel — medical questions to <strong>#triage-medical</strong>, urgent cases to <strong>#triage-urgent</strong>, and so on. Your team only sees what's relevant to them, with full context already prepared.
        <br /><br />
        <strong>Cost:</strong> Free tier is sufficient for a team of up to 10 people.
      </p>

      <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm text-gray-600 border border-gray-100">
        <p className="font-medium mb-2">First, create these 6 channels in your Slack workspace:</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["#triage-urgent", "P1 alerts — act immediately"],
            ["#triage-medical", "Medical questions"],
            ["#triage-orders", "Order & payment issues"],
            ["#triage-business", "B2B & partnership leads"],
            ["#triage-faq", "Auto-resolved confirmations"],
            ["#daily-briefing", "Morning inbox summary"],
          ].map(([ch, desc]) => (
            <div key={ch} className="bg-white border border-gray-200 rounded px-2 py-1.5">
              <p className="font-mono text-xs font-medium text-gray-800">{ch}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <ol className="text-sm text-gray-600 mb-5 space-y-2 list-decimal list-inside">
        <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">api.slack.com/apps</a> → <strong>Create New App</strong> → From scratch</li>
        <li>Name it <strong>"Metabelly Triage"</strong> → select your workspace</li>
        <li><strong>OAuth & Permissions</strong> → add scopes: <code className="bg-gray-100 px-1 rounded">chat:write</code> and <code className="bg-gray-100 px-1 rounded">chat:write.public</code></li>
        <li>Click <strong>Install to Workspace</strong> → approve → copy the <strong>Bot OAuth Token</strong></li>
      </ol>

      <label className="block text-sm font-medium text-gray-700 mb-1">Bot OAuth Token</label>
      <input
        type="password"
        placeholder="xoxb-..."
        value={token}
        onChange={(e) => { setToken(e.target.value); setStatus("idle") }}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && validate()}
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={status === "success" ? () => onComplete({ slack_bot_token: token }) : validate}
        disabled={!token.trim() || status === "loading"}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
        style={{ backgroundColor: config.primaryColor }}
      >
        {status === "loading" ? "Validating..." : status === "success" ? "✓ Continue" : "Validate & Continue"}
      </button>
    </div>
  )
}
