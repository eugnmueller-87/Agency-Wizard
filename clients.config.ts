export type StepKey = "n8n" | "mistral" | "gmail" | "slack" | "supabase" | "calendly" | "wordpress" | "checklist" | "launch"

export interface ClientConfig {
  name: string
  slug: string
  logo?: string
  primaryColor: string
  gmailAccounts: string[]
  workflows: string[]
  steps: StepKey[]
}

const clients: Record<string, ClientConfig> = {
  metabelly: {
    name: "Metabelly",
    slug: "metabelly",
    primaryColor: "#3d6b35",
    gmailAccounts: ["support@metabelly.com", "info@metabelly.com"],
    workflows: [
      "01-email-triage",
      "02-slack-notify",
      "03-auto-reply",
      "04-daily-briefing",
    ],
    steps: ["n8n", "mistral", "gmail", "slack", "supabase", "calendly", "wordpress", "checklist", "launch"],
  },
}

export const STEP_LABELS: Record<StepKey, string> = {
  n8n: "n8n Cloud",
  mistral: "Mistral AI",
  gmail: "Gmail",
  slack: "Slack",
  supabase: "Supabase",
  calendly: "Calendly",
  wordpress: "WordPress",
  checklist: "Checklist",
  launch: "Launch",
}

export function getClient(slug: string): ClientConfig | null {
  return clients[slug] ?? null
}
