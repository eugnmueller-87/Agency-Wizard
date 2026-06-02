"use client"

import { useState } from "react"
import { StepProps } from "../WizardShell"

const WORKFLOWS = [
  { file: "01-email-triage.json", label: "01 — Email Triage" },
  { file: "02-slack-notify.json", label: "02 — Slack Notify" },
  { file: "03-auto-reply.json",   label: "03 — Auto Reply" },
  { file: "04-daily-briefing.json", label: "04 — Daily Briefing" },
]

const ITEMS = [
  {
    id: "workflows_imported",
    label: "All 4 workflows imported into n8n",
    detail: "Download the files below → in n8n go to Workflows → Import → upload each file → tag them all with 'metabelly'",
  },
  {
    id: "gmail_api",
    label: "Gmail API enabled for both inboxes",
    detail: "Google Workspace admin → admin.google.com → Apps → Google Workspace → Gmail → ON for support@ and info@metabelly.com",
  },
  {
    id: "n8n_gmail_oauth",
    label: "Gmail OAuth completed inside n8n",
    detail: "n8n → Credentials → Gmail (support@) and Gmail (info@) → click 'Sign in with Google' → log in with each account",
  },
  {
    id: "slack_installed",
    label: "Slack bot installed in workspace",
    detail: "A Slack admin must approve the 'Metabelly Triage' bot installation in the Metabelly Slack workspace",
  },
  {
    id: "supabase_schema",
    label: "Supabase database schema applied",
    detail: "Run the SQL migrations from the agency repo against the Supabase project to create the email_triage table",
  },
]

export default function StepChecklist({ config, onComplete }: StepProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const allDone = ITEMS.every((item) => checked[item.id])

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-lg">✅</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pre-Launch Checklist</h2>
          <p className="text-sm text-gray-500">Confirm everything is in place before activating the system</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
        All credentials are collected. Before activating, confirm each item below — otherwise workflows will fail after launch.
      </p>

      {/* Workflow downloads */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-gray-800 mb-3">Download & import workflows into n8n first:</p>
        <div className="grid grid-cols-2 gap-2">
          {WORKFLOWS.map((wf) => (
            <a
              key={wf.file}
              href={`/workflows/${wf.file}`}
              download={wf.file}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:border-gray-400 transition-colors"
            >
              <span className="text-base">⬇️</span>
              <span className="text-gray-700 font-medium text-xs">{wf.label}</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">n8n → Workflows → ⋯ → Import → upload each file → tag all with <code className="bg-gray-100 px-1 rounded">metabelly</code></p>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 mb-6">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-all"
            style={{
              borderColor: checked[item.id] ? config.primaryColor : "#e5e7eb",
              backgroundColor: checked[item.id] ? "#f0f7ee" : "white",
            }}
          >
            <div
              className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all"
              style={{
                borderColor: checked[item.id] ? config.primaryColor : "#d1d5db",
                backgroundColor: checked[item.id] ? config.primaryColor : "white",
              }}
            >
              {checked[item.id] && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete({ checklist_done: "true" })}
        disabled={!allDone}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-opacity disabled:opacity-40"
        style={{ backgroundColor: config.primaryColor }}
      >
        {allDone ? "All confirmed — proceed to Launch →" : `${ITEMS.filter(i => checked[i.id]).length} / ${ITEMS.length} confirmed`}
      </button>
    </div>
  )
}
