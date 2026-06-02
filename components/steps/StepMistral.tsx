"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepMistral({ config, collected, onComplete }: StepProps) {
  const [key, setKey] = useState(collected.mistral_api_key || "")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    collected.mistral_api_key ? "success" : "idle"
  )
  const [error, setError] = useState("")

  async function validate() {
    if (!key.trim()) return
    setStatus("loading")
    setError("")

    const res = await fetch("/api/validate/mistral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: key }),
    })

    if (res.ok) {
      setStatus("success")
      setTimeout(() => onComplete({ mistral_api_key: key }), 800)
    } else {
      const data = await res.json()
      setStatus("error")
      setError(data.error ?? "Invalid API key")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">🤖</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mistral AI</h2>
          <p className="text-sm text-gray-500">The AI brain that reads and classifies every customer message</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        Mistral AI is a European AI provider (Paris-based, GDPR-compliant). It reads each incoming message and decides: is this a product question, a medical inquiry, an order issue, or a business lead? It also detects the language and decides whether a human needs to respond.
        <br /><br />
        <strong>Cost:</strong> Roughly €0.20/month at your current message volume. Load €10 in credits and you're covered for years.
      </p>

      <ol className="text-sm text-gray-600 mb-5 space-y-2 list-decimal list-inside">
        <li>Go to <a href="https://console.mistral.ai" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">console.mistral.ai</a> and create an account</li>
        <li>Go to <strong>Billing</strong> → add a payment method → load at least <strong>€10</strong> in credits</li>
        <li>Go to <strong>API Keys</strong> → click <strong>Create new key</strong> → copy it below</li>
      </ol>

      <label className="block text-sm font-medium text-gray-700 mb-1">Mistral API Key</label>
      <input
        type="password"
        placeholder="Paste your API key here..."
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-offset-1"
        onKeyDown={(e) => e.key === "Enter" && validate()}
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={validate}
        disabled={!key.trim() || status === "loading" || status === "success"}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
        style={{ backgroundColor: config.primaryColor }}
      >
        {status === "loading" ? "Validating..." : status === "success" ? "✓ Connected" : "Validate & Continue"}
      </button>
    </div>
  )
}
