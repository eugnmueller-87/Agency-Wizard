# Agency Wizard

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat&logo=n8n&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Internal onboarding wizard for deploying AI automation systems to clients in a single 3-hour session. Used by the agency during live onboarding — the client logs into their own accounts while the wizard provisions everything directly into their infrastructure.

**Live:** [onboard.eugenmueller.tech](https://onboard.eugenmueller.tech)

---

## What it does

Walks through every integration step-by-step, validates each credential live, then pushes everything into the client's own n8n Cloud instance in one shot:

- **n8n Cloud** — connects to the client's own instance, validates API key
- **Mistral AI** — validates key against Mistral API, pushes credential into n8n
- **Gmail** — OAuth2 setup for multiple branded inboxes
- **Slack** — bot token validation, workspace connection
- **Supabase** — URL + anon key validation, set as n8n variables
- **Calendly** — consultation link stored as n8n variable
- **WordPress** — generates ready-to-paste chat widget snippet with brand config baked in
- **Launch** — activates all workflows tagged with the client slug, sends agency Slack notification

Credentials are never stored — they flow through browser memory, get pushed to the client's n8n, and are gone.

---

## Architecture

```
clients.config.ts          ← one entry per client (colors, emails, steps)
app/[client]/page.tsx      ← dynamic route per client slug
components/PasswordGate    ← session password gate (env var, never in code)
components/WizardShell     ← progress bar, step routing
components/steps/          ← one component per integration
app/api/validate/          ← server-side credential validation
app/api/provision/         ← pushes all credentials into client's n8n
public/widget/chat.js      ← standalone chat widget (vanilla JS, no deps)
```

---

## Adding a new client

Add one entry to `clients.config.ts`:

```typescript
newclient: {
  name: "Client Name",
  slug: "newclient",
  primaryColor: "#your-color",
  gmailAccounts: ["support@client.com"],
  workflows: ["01-email-triage", "02-slack-notify"],
  steps: ["n8n", "mistral", "gmail", "slack", "launch"],
}
```

Wizard is immediately available at `onboard.eugenmueller.tech/newclient`.

---

## Security

- Password gate on every client route (`WIZARD_PASSWORD` env var)
- Credentials never written to disk or database
- Each client's keys go into their own n8n instance — no cross-client access
- HTTPS only via Vercel
- `.env` files gitignored

---

## Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (auto-deploy on push)
- **Automation:** n8n Cloud (per-client instances)
