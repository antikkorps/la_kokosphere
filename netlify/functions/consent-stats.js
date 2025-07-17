import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

exports.handler = async function (event, context) {
  // Autoriser les requêtes CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  }

  // Gérer les requêtes OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    }
  }

  // Vérifier que c'est une requête POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Méthode non autorisée" }),
    }
  }

  try {
    const body = JSON.parse(event.body)
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result._id,
        message: "Consentement enregistré avec succès",
      }),
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du consentement:", error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    }
  }
}
