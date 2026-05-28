"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepSupabase({ config, onComplete }: StepProps) {
  const [url, setUrl] = useState("")
  const [key, setKey] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  async function validate() {
    if (!url.trim() || !key.trim()) return
    setStatus("loading")
    setError("")

    const res = await fetch("/api/validate/supabase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, key }),
    })

    if (res.ok) {
      setStatus("success")
      setTimeout(() => onComplete({ supabase_url: url, supabase_anon_key: key }), 800)
    } else {
      const data = await res.json()
      setStatus("error")
      setError(data.error ?? "Could not connect to Supabase")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">🗄️</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Supabase</h2>
          <p className="text-sm text-gray-500">Your database — stores the triage log and audit trail</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        Supabase is an open-source database hosted in the EU (Frankfurt). Every message processed by the system is logged here — category, priority, action taken — so you always have a full audit trail.
        <br /><br />
        <strong>Cost:</strong> Free tier covers up to 50,000 rows. You won't hit this limit for years at current volume.
      </p>

      <ol className="text-sm text-gray-600 mb-5 space-y-2 list-decimal list-inside">
        <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">supabase.com</a> → <strong>New project</strong></li>
        <li>Choose <strong>Frankfurt (eu-central-1)</strong> as the region</li>
        <li>Go to <strong>Project Settings → API</strong> → copy the <strong>Project URL</strong> and <strong>anon public</strong> key</li>
      </ol>

      <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
      <input
        type="text"
        placeholder="https://xxxxxxxxxxxx.supabase.co"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Anon Public Key</label>
      <input
        type="password"
        placeholder="eyJ..."
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={validate}
        disabled={!url.trim() || !key.trim() || status === "loading" || status === "success"}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
        style={{ backgroundColor: config.primaryColor }}
      >
        {status === "loading" ? "Connecting..." : status === "success" ? "✓ Connected" : "Validate & Continue"}
      </button>
    </div>
  )
}
