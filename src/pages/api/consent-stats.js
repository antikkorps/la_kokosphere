import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

export async function POST({ request }) {
  try {
    const body = await request.json()
    const { analytics, marketing, necessary, method } = body

    // Calculer la date d'expiration (6 mois)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)

    const consentData = {
      _type: "consentStats",
      date: new Date().toISOString(),
      ip: "anonymisé",
      userAgent: "anonymisé",
      method: method || "banner",
      consentChoices: {
        necessary: true,
        analytics: analytics || false,
        marketing: marketing || false,
      },
      expiresAt: expiresAt.toISOString(),
    }

    const result = await client.create(consentData)

    return new Response(
      JSON.stringify({
        success: true,
        id: result._id,
        message: "Consentement enregistré avec succès",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du consentement:", error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}
