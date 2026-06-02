"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepGmail({ config, onComplete }: StepProps) {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")

  function handleContinue() {
    onComplete({
      gmail_client_id: clientId.trim(),
      gmail_client_secret: clientSecret.trim(),
    })
  }

  const ready = clientId.trim() && clientSecret.trim()

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">📧</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gmail</h2>
          <p className="text-sm text-gray-500">Connect the inboxes the system will monitor</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        The system monitors <strong>{config.gmailAccounts.join(" and ")}</strong> for incoming messages.
        Gmail connects via OAuth2 — you provide the Client ID and Secret from Google Cloud, and n8n handles
        the actual login after setup. Your password is never touched.
        <br /><br />
        <strong>One-time setup:</strong> These credentials come from the Google Cloud project already configured for Metabelly.
      </p>

      <ol className="text-sm text-gray-600 mb-5 space-y-2 list-decimal list-inside">
        <li>Go to <strong>console.cloud.google.com</strong> → select the <strong>Metabelly</strong> project</li>
        <li>APIs &amp; Services → <strong>Credentials</strong></li>
        <li>Click the existing <strong>OAuth 2.0 Client ID</strong> (type: Web application)</li>
        <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> below</li>
      </ol>

      <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
      <input
        type="text"
        placeholder="123456789-abc...apps.googleusercontent.com"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
      <input
        type="password"
        placeholder="GOCSPX-..."
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-5 focus:outline-none"
      />

      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800 mb-5">
        <strong>After launch:</strong> Open n8n → find each Gmail credential → click <em>Connect</em> → log in with the respective Google account. This completes the OAuth flow inside n8n directly.
      </div>

      <button
        onClick={handleContinue}
        disabled={!ready}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-50"
        style={{ backgroundColor: config.primaryColor }}
      >
        Continue
      </button>
    </div>
  )
}
