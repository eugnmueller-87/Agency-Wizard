"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

export default function StepWordPress({ config, collected, onComplete }: StepProps) {
  const [copied, setCopied] = useState(false)

  const webhookUrl = collected.chat_webhook_url ||
    `https://n8n-n3xl.eugenmueller.tech/webhook/metabelly-chat`

  const snippet = `<!-- ${config.name} AI Chat Widget -->
<script>
  window.__AGENCY_CHAT_CONFIG__ = {
    color: "${config.primaryColor}",
    webhook: "${webhookUrl}",
    brandName: "${config.name}",
    placeholder: "How can we help you?",
    greeting: "Hi! How can we help you today?"
  };
</script>
<script src="https://onboard.eugenmueller.tech/widget/chat.js" defer></script>`

  function copy() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🌐</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">WordPress Chat Widget</h2>
          <p className="text-sm text-gray-500">Replace the current chat bubble with your smart triage widget</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        This replaces the existing HubSpot chat widget with a smart widget that instantly classifies every message — FAQ questions get answered automatically, medical questions get a warm response with a consultation booking link, and your team gets notified in Slack for everything else.
        <br /><br />
        The snippet below is already configured with your brand color and webhook URL. Just paste it into your WordPress header.
      </p>

      <ol className="text-sm text-gray-600 mb-4 space-y-2 list-decimal list-inside">
        <li>Log in to your WordPress admin (<strong>yoursite.com/wp-admin</strong>)</li>
        <li>Go to <strong>Appearance → Theme File Editor</strong> or use a plugin like <strong>Insert Headers and Footers</strong></li>
        <li>Paste the snippet below into the <strong>&lt;head&gt;</strong> section</li>
        <li>Save — the new widget appears immediately, HubSpot widget is replaced</li>
      </ol>

      <div className="relative mb-4">
        <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {snippet}
        </pre>
        <button
          onClick={copy}
          className="absolute top-3 right-3 text-xs px-3 py-1.5 rounded-md font-medium transition-all"
          style={{
            backgroundColor: copied ? "#d1fae5" : config.primaryColor,
            color: copied ? "#065f46" : "white",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <button
        onClick={() => onComplete({ wordpress_done: "true" })}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity mb-2"
        style={{ backgroundColor: config.primaryColor }}
      >
        Done — Continue to Launch
      </button>
      <button
        onClick={() => onComplete({ wordpress_done: "false" })}
        className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Skip — I'll add this later
      </button>
    </div>
  )
}
