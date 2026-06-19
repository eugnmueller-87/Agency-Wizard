import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/clients.config"

async function upsertN8nCredential(
  n8nUrl: string,
  n8nApiKey: string,
  name: string,
  type: string,
  data: Record<string, string>
) {
  const listRes = await fetch(`${n8nUrl}/api/v1/credentials`, {
    headers: { "X-N8N-API-KEY": n8nApiKey },
  })
  const { data: existing } = await listRes.json()
  const found = existing?.find((c: { name: string }) => c.name === name)

  if (found) {
    const res = await fetch(`${n8nUrl}/api/v1/credentials/${found.id}`, {
      method: "PATCH",
      headers: { "X-N8N-API-KEY": n8nApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, data }),
    })
    return res.ok
  } else {
    const res = await fetch(`${n8nUrl}/api/v1/credentials`, {
      method: "POST",
      headers: { "X-N8N-API-KEY": n8nApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, data }),
    })
    return res.ok
  }
}

async function setN8nVariable(n8nUrl: string, n8nApiKey: string, key: string, value: string) {
  const listRes = await fetch(`${n8nUrl}/api/v1/variables`, {
    headers: { "X-N8N-API-KEY": n8nApiKey },
  })
  const { data: vars } = await listRes.json()
  const found = vars?.find((v: { key: string }) => v.key === key)

  if (found) {
    await fetch(`${n8nUrl}/api/v1/variables/${found.id}`, {
      method: "PATCH",
      headers: { "X-N8N-API-KEY": n8nApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
  } else {
    await fetch(`${n8nUrl}/api/v1/variables`, {
      method: "POST",
      headers: { "X-N8N-API-KEY": n8nApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
  }
}

export async function POST(req: NextRequest) {
  const { client: slug, credentials } = await req.json()

  const config = getClient(slug)
  if (!config) {
    return NextResponse.json({ error: "Unknown client" }, { status: 400 })
  }

  const n8nUrl = credentials.n8n_url
  const n8nApiKey = credentials.n8n_api_key

  if (!n8nUrl || !n8nApiKey) {
    return NextResponse.json({ error: "n8n_url and n8n_api_key are required" }, { status: 400 })
  }

  const log: string[] = []

  try {
    if (credentials.mistral_api_key) {
      const ok1 = await upsertN8nCredential(
        n8nUrl, n8nApiKey,
        `Mistral Cloud ${config.name}`,
        "mistralCloudApi",
        { apiKey: credentials.mistral_api_key }
      )
      const ok2 = await upsertN8nCredential(
        n8nUrl, n8nApiKey,
        "Mistral API Key",
        "httpHeaderAuth",
        { name: "Authorization", value: `Bearer ${credentials.mistral_api_key}` }
      )
      log.push(ok1 && ok2 ? "✓ Mistral credential saved" : "✗ Mistral credential failed")
    }

    if (credentials.slack_bot_token) {
      const ok = await upsertN8nCredential(
        n8nUrl, n8nApiKey,
        `Slack — ${config.name}`,
        "slackApi",
        { accessToken: credentials.slack_bot_token }
      )
      log.push(ok ? "✓ Slack credential saved" : "✗ Slack credential failed")
    }

    if (credentials.gmail_client_id) {
      for (const email of config.gmailAccounts) {
        const ok = await upsertN8nCredential(
          n8nUrl, n8nApiKey,
          `Gmail — ${email}`,
          "gmailOAuth2",
          {
            clientId: credentials.gmail_client_id,
            clientSecret: credentials.gmail_client_secret,
          }
        )
        log.push(ok ? `✓ Gmail ${email} credential saved` : `✗ Gmail ${email} failed`)
      }
    }

    if (credentials.supabase_url) {
      await setN8nVariable(n8nUrl, n8nApiKey, "SUPABASE_URL", credentials.supabase_url)
      await setN8nVariable(n8nUrl, n8nApiKey, "SUPABASE_ANON_KEY", credentials.supabase_anon_key)
      log.push("✓ Supabase variables set")
    }

    if (credentials.calendly_url) {
      await setN8nVariable(n8nUrl, n8nApiKey, "CONSULTATION_URL", credentials.calendly_url)
      log.push("✓ Calendly URL set")
    }

    // Activate workflows tagged with client slug
    const listRes = await fetch(`${n8nUrl}/api/v1/workflows?tags=${slug}`, {
      headers: { "X-N8N-API-KEY": n8nApiKey },
    })
    const { data: workflows } = await listRes.json()
    log.push(`Found ${workflows?.length ?? 0} workflows`)

    for (const wf of workflows ?? []) {
      const res = await fetch(`${n8nUrl}/api/v1/workflows/${wf.id}/activate`, {
        method: "POST",
        headers: { "X-N8N-API-KEY": n8nApiKey },
      })
      log.push(res.ok ? `✓ Activated: ${wf.name}` : `✗ Failed: ${wf.name}`)
    }

    // Notify agency Slack — credentials not persisted beyond this request
    const webhookUrl = process.env.AGENCY_SLACK_WEBHOOK
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [
            `🎉 *${config.name} onboarding complete!*`,
            `n8n: ${n8nUrl}`,
            `Mistral: ${credentials.mistral_api_key ? "✓" : "—"}`,
            `Gmail: ${config.gmailAccounts.join(", ")}`,
            `Slack: ${credentials.slack_bot_token ? "✓" : "—"}`,
            `Supabase: ${credentials.supabase_url ? "✓" : "—"}`,
            `Calendly: ${credentials.calendly_url || "Skipped"}`,
            `Time: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`,
          ].join("\n"),
        }),
      }).catch(() => {})
    }

    log.push("🚀 All done — system is live!")
    return NextResponse.json({ ok: true, log })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
