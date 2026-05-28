"use client"

import { useState } from "react"
import { ClientConfig, STEP_LABELS, StepKey } from "@/clients.config"
import StepN8n from "./steps/StepN8n"
import StepMistral from "./steps/StepMistral"
import StepGmail from "./steps/StepGmail"
import StepSlack from "./steps/StepSlack"
import StepSupabase from "./steps/StepSupabase"
import StepCalendly from "./steps/StepCalendly"
import StepWordPress from "./steps/StepWordPress"
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
    case "calendly":   return <StepCalendly {...props} />
    case "wordpress":  return <StepWordPress {...props} />
    case "launch":     return <StepLaunch {...props} />
  }
}

export default function WizardShell({ config }: { config: ClientConfig }) {
  const [step, setStep] = useState(0)
  const [collected, setCollected] = useState<Record<string, string>>({})

  const steps = config.steps
  const currentKey = steps[step]

  function handleComplete(data: Record<string, string>) {
    const updated = { ...collected, ...data }
    setCollected(updated)
    setStep((s) => s + 1)
  }

  const stepProps: StepProps = { config, onComplete: handleComplete, collected }
  const progress = step / (steps.length - 1)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <div
          className="inline-block px-4 py-1 rounded-full text-white text-sm font-medium mb-4"
          style={{ backgroundColor: config.primaryColor }}
        >
          Setup Wizard
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
        <p className="text-gray-500 mt-2">Connect your accounts to activate the AI triage system</p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-start justify-between mb-3">
          {steps.map((key, i) => (
            <div key={key} className="flex flex-col items-center flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  backgroundColor: i <= step ? config.primaryColor : "#e5e7eb",
                  color: i <= step ? "white" : "#9ca3af",
                  opacity: i <= step ? 1 : 0.5,
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-1 text-center ${i <= step ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                {STEP_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, backgroundColor: config.primaryColor }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {step < steps.length && renderStep(currentKey, stepProps)}
      </div>
    </div>
  )
}
