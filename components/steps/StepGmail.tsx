"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepGmail({ config, onComplete }: StepProps) {
  const [connected, setConnected] = useState<string[]>([])

  function connectAccount(email: string) {
    const params = new URLSearchParams({
      client: config.slug,
      email,
      redirect: window.location.href,
    })
    window.location.href = `/api/auth/gmail?${params}`
  }

  function handleContinue() {
    const data: Record<string, string> = {}
    connected.forEach((email, i) => { data[`gmail_${i}`] = email })
    onComplete(data)
  }

  const allConnected = config.gmailAccounts.every((e) => connected.includes(e))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">📧</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gmail</h2>
          <p className="text-sm text-gray-500">Connect the inboxes the system will monitor</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {config.gmailAccounts.map((email) => {
          const done = connected.includes(email)
          return (
            <div key={email} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{email}</p>
                <p className="text-xs text-gray-400">{done ? "Connected" : "Not connected"}</p>
              </div>
              <button
                onClick={() => !done && connectAccount(email)}
                className="text-sm px-4 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: done ? "#d1fae5" : config.primaryColor,
                  color: done ? "#065f46" : "white",
                }}
              >
                {done ? "✓ Done" : "Connect"}
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!allConnected}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
        style={{ backgroundColor: config.primaryColor }}
      >
        Continue
      </button>
    </div>
  )
}
