"use client"

import { useEffect, useState } from "react"
import { ClientConfig, STEP_LABELS, StepKey } from "@/clients.config"
import StepN8n from "./steps/StepN8n"
import StepMistral from "./steps/StepMistral"
import StepGmail from "./steps/StepGmail"
import StepSlack from "./steps/StepSlack"
import StepSupabase from "./steps/StepSupabase"
import StepCalendly from "./steps/StepCalendly"
import StepWordPress from "./steps/StepWordPress"
import StepChecklist from "./steps/StepChecklist"
import StepLaunch from "./steps/StepLaunch"

export interface StepProps {
  config: ClientConfig
  onComplete: (data: Record<string, string>) => void
  collected: Record<string, string>
}

function renderStep(key: StepKey, props: StepProps) {
  switch (key) {
    case "n8n":       return <StepN8n {...props} />
    case "mistral":   return <StepMistral {...props} />
    case "gmail":     return <StepGmail {...props} />
    case "slack":     return <StepSlack {...props} />
    case "supabase":  return <StepSupabase {...props} />
    case "calendly":  return <StepCalendly {...props} />
    case "wordpress":  return <StepWordPress {...props} />
    case "checklist":  return <StepChecklist {...props} />
    case "launch":     return <StepLaunch {...props} />
  }
}

function storageKey(slug: string) {
  return `wizard_${slug}`
}

export default function WizardShell({ config }: { config: ClientConfig }) {
  const [step, setStep] = useState(0)
  const [collected, setCollected] = useState<Record<string, string>>({})
  const [restored, setRestored] = useState(false)

  // Restore progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(config.slug))
      if (saved) {
        const { step: s, collected: c } = JSON.parse(saved)
        setStep(s ?? 0)
        setCollected(c ?? {})
      }
    } catch {}
    setRestored(true)
  }, [config.slug])

  // Persist progress whenever step or collected changes
  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(storageKey(config.slug), JSON.stringify({ step, collected }))
    } catch {}
  }, [step, collected, restored, config.slug])

  function handleComplete(data: Record<string, string>) {
    const updated = { ...collected, ...data }
    setCollected(updated)
    setStep((s) => s + 1)
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  function skipStep() {
    setStep((s) => s + 1)
  }

  function resetWizard() {
    try { localStorage.removeItem(storageKey(config.slug)) } catch {}
    setStep(0)
    setCollected({})
  }

  const steps = config.steps
  const currentKey = steps[step]
  const stepProps: StepProps = { config, onComplete: handleComplete, collected }
  const progress = step / (steps.length - 1)
  const color = config.primaryColor
  const isFirst = step === 0
  const isLast = step === steps.length - 1
  const isLaunch = currentKey === "launch"
  const isChecklist = currentKey === "checklist"

  if (!restored) return null

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f7f9f5", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      {/* Top bar */}
      <div
        className="w-full py-4 px-6 flex items-center justify-between"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg tracking-wide">{config.name.toUpperCase()}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          >
            AI Setup
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm opacity-70">
            Step {Math.min(step + 1, steps.length)} of {steps.length}
          </span>
          {step > 0 && step < steps.length && (
            <button
              onClick={resetWizard}
              className="text-xs opacity-50 hover:opacity-80 text-white underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        {/* Progress stepper */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-start justify-between mb-3">
            {steps.map((key, i) => (
              <div key={key} className="flex flex-col items-center flex-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2"
                  style={{
                    backgroundColor: i < step ? color : i === step ? color : "white",
                    borderColor: i <= step ? color : "#d1d5db",
                    color: i <= step ? "white" : "#9ca3af",
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className="text-xs mt-1.5 text-center leading-tight max-w-[56px]"
                  style={{ color: i <= step ? "#1f2937" : "#9ca3af", fontWeight: i === step ? 600 : 400 }}
                >
                  {STEP_LABELS[key]}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-200 rounded-full mt-2">
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1" style={{ backgroundColor: color }} />
          <div className="p-8">
            {step < steps.length && renderStep(currentKey, stepProps)}
          </div>
        </div>

        {/* Back / Skip row */}
        {!isLaunch && (
          <div className="w-full max-w-2xl flex justify-between mt-3">
            <button
              onClick={goBack}
              disabled={isFirst}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-0 disabled:pointer-events-none transition-colors"
            >
              ← Back
            </button>
            {!isChecklist && (
              <button
                onClick={skipStep}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Skip →
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          Secured session · credentials are never stored
        </p>
      </div>
    </div>
  )
}
