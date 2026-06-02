"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepN8n({ config, collected, onComplete }: StepProps) {
  const [url, setUrl] = useState(collected.n8n_url || "")
  const [apiKey, setApiKey] = useState(collected.n8n_api_key || "")
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "error">(
    collected.n8n_url && collected.n8n_api_key ? "ok" : "idle"
  )
  const [errorMsg, setErrorMsg] = useState("")

  async function validate() {
    const trimUrl = url.trim().replace(/\/$/, "")
    if (!trimUrl || !apiKey.trim()) {
      setStatus("error")
      setErrorMsg("Both instance URL and API key are required.")
      return
    }
    setStatus("checking")
    setErrorMsg("")
    try {
      const res = await fetch("/api/validate/n8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n8nUrl: trimUrl, n8nApiKey: apiKey.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus("ok")
      } else {
        setStatus("error")
        setErrorMsg(data.error || "Could not connect to n8n. Check the URL and API key.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error — check the instance URL.")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">⚙️</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">n8n Cloud Instance</h2>
          <p className="text-sm text-gray-500">Connect your automation workspace</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        Your automation workflows run on your own n8n Cloud instance — you own it and pay for it directly (~€20/month). This keeps your data and API keys under your control, completely separate from any other client.
        <br /><br />
        If you don't have an account yet, go to <strong>n8n.io/cloud</strong>, create a free trial, and copy your instance URL (e.g. <code>https://your-name.app.n8n.cloud</code>). You'll find the API key under <strong>Settings → n8n API → Create Key</strong>.
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instance URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setStatus("idle") }}
            placeholder="https://your-name.app.n8n.cloud"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": config.primaryColor } as React.CSSProperties}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setStatus("idle") }}
            placeholder="n8n_api_…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": config.primaryColor } as React.CSSProperties}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 mb-3 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
      )}
      {status === "ok" && (
        <p className="text-sm text-green-700 mb-3 bg-green-50 rounded-lg px-3 py-2">
          Connected successfully.
        </p>
      )}

      {status !== "ok" && (
        <button
          onClick={validate}
          disabled={status === "checking"}
          className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity mb-2 disabled:opacity-50"
          style={{ backgroundColor: config.primaryColor }}
        >
          {status === "checking" ? "Connecting…" : "Connect n8n"}
        </button>
      )}

      {status === "ok" && (
        <button
          onClick={() => onComplete({ n8n_url: url.trim().replace(/\/$/, ""), n8n_api_key: apiKey.trim() })}
          className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity"
          style={{ backgroundColor: config.primaryColor }}
        >
          Continue
        </button>
      )}
    </div>
  )
}
