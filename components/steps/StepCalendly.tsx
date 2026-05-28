"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepCalendly({ config, onComplete }: StepProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  function validate() {
    if (!url.trim()) return
    if (!url.includes("calendly.com/")) {
      setError("Must be a valid Calendly link (calendly.com/...)")
      return
    }
    onComplete({ calendly_url: url })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">📅</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Calendly</h2>
          <p className="text-sm text-gray-500">Booking link sent automatically in medical auto-replies</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        When a customer writes in with a medical question, the system sends a warm reply acknowledging their concern and offering them a direct link to book a consultation with your team. This link goes here.
        <br /><br />
        <strong>One link covers everything</strong> — no need for separate links per question type. A single "Consultation" event type on the free Calendly tier is all you need.
      </p>

      <ol className="text-sm text-gray-600 mb-5 space-y-2 list-decimal list-inside">
        <li>Go to <a href="https://calendly.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">calendly.com</a> → sign up for free</li>
        <li>Create one event type → name it <strong>"Consultation"</strong></li>
        <li>Set your available times → copy the booking link</li>
      </ol>

      <label className="block text-sm font-medium text-gray-700 mb-1">Booking Link</label>
      <input
        type="text"
        placeholder="https://calendly.com/metabelly/consultation"
        value={url}
        onChange={(e) => { setUrl(e.target.value); setError("") }}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && validate()}
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={validate}
        disabled={!url.trim()}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50 mb-2"
        style={{ backgroundColor: config.primaryColor }}
      >
        Save & Continue
      </button>
      <button
        onClick={() => onComplete({ calendly_url: "" })}
        className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Skip for now — I'll set this up later
      </button>
    </div>
  )
}
