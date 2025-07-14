import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

async function createTestConsent() {
  console.log("🧪 Création d'un document de test de consentement...\n")

  try {
    // Calculer la date d'expiration (6 mois)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)

    const testConsent = {
      _type: "consentStats",
      date: new Date().toISOString(),
      ip: "test-ip-anonymisé",
      userAgent: "test-user-agent",
      method: "banner",
      consentChoices: {
        necessary: true,
        analytics: true,
        marketing: false,
      },
      expiresAt: expiresAt.toISOString(),
    }

    const result = await client.create(testConsent)
    console.log("✅ Document de test créé avec succès !")
    console.log("ID:", result._id)
    console.log("Date:", new Date(result.date).toLocaleDateString("fr-FR"))
    console.log("Expire le:", new Date(result.expiresAt).toLocaleDateString("fr-FR"))

    console.log("\n🎯 Maintenant vous devriez voir ce document dans Sanity Studio !")
  } catch (error) {
    console.error("❌ Erreur lors de la création:", error)

    if (error.message.includes("Unknown document type")) {
      console.log("\n💡 Le schéma 'consentStats' n'est pas encore disponible.")
      console.log("Essayez de redémarrer Sanity Studio avec 'npm run dev'")
    }
  }
}

createTestConsent()
