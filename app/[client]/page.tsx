import { getClient } from "@/clients.config"
import { notFound } from "next/navigation"
import WizardShell from "@/components/WizardShell"

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client: string }>
}) {
  const { client } = await params
  const config = getClient(client)
  if (!config) notFound()

  return <WizardShell config={config} />
}
