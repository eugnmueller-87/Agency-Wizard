"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepLaunch({ config, collected }: StepProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [log, setLog] = useState<string[]>([])
  const [error, setError] = useState("")

  async function launch() {
    setStatus("loading")
    setLog([])
    setError("")

    const res = await fetch("/api/provision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client: config.slug, credentials: collected }),
    })

    const data = await res.json()

    if (res.ok) {
      setLog(data.log ?? [])
      setStatus("success")
    } else {
      setError(data.error ?? "Something went wrong")
      setStatus("error")
    }
  }

  const summary = [
    { label: "Mistral AI", value: collected.mistral_api_key ? "✓ Ready" : "—", ok: !!collected.mistral_api_key },
    { label: "Gmail", value: config.gmailAccounts.join(", "), ok: true },
    { label: "Slack", value: collected.slack_bot_token ? "✓ Ready" : "—", ok: !!collected.slack_bot_token },
    { label: "Supabase", value: collected.supabase_url ? "✓ Ready" : "—", ok: !!collected.supabase_url },
    { label: "Calendly", value: collected.calendly_url || "Skipped", ok: true },
    { label: "Workflows", value: config.workflows.length + " workflows", ok: true },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">🚀</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ready to Launch</h2>
          <p className="text-sm text-gray-500">Review your setup and activate the system</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 mt-1 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        All credentials will be pushed directly into the automation system and immediately deleted from this page. Nothing is stored on our servers.
      </p>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mb-6">
        {summary.map(({ label, value, ok }) => (
          <div key={label} className="flex justify-between px-4 py-3 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className={`font-medium truncate max-w-xs text-right ${ok ? "text-gray-800" : "text-gray-400"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {log.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 font-mono text-xs text-gray-600 space-y-1">
          {log.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {status === "success" ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-semibold text-gray-900">System is live!</p>
          <p className="text-sm text-gray-500 mt-1">
            All workflows are active. Your team will start receiving notifications in Slack shortly.
          </p>
        </div>
      ) : (
        <button
          onClick={launch}
          disabled={status === "loading"}
          className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
          style={{ backgroundColor: config.primaryColor }}
        >
          {status === "loading" ? "Activating system..." : "Activate System"}
        </button>
      )}
    </div>
  )
}
