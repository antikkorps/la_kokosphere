import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function testConsentSystem() {
  console.log("🧪 Test du système de consentement...\n")

  try {
    // Test 1: Vérifier la structure du schéma
    console.log("📋 Test 1: Vérification de la structure")
    const consentStats = await client.fetch(`
      *[_type == "consentStats"] | order(date desc)[0...5] {
        _id,
        date,
        method,
        "choices": consentChoices,
        expiresAt
      }
    `)

    console.log(`📊 ${consentStats.length} consentements trouvés\n`)

    consentStats.forEach((consent, index) => {
      const consentDate = new Date(consent.date).toLocaleDateString("fr-FR")
      const expiryDate = new Date(consent.expiresAt).toLocaleDateString("fr-FR")
      const choices = []
      if (consent.choices.analytics) choices.push("Analytics")
      if (consent.choices.marketing) choices.push("Marketing")

      console.log(`${index + 1}. Consentement du ${consentDate}`)
      console.log(`   Expire le: ${expiryDate}`)
      console.log(`   Méthode: ${consent.method}`)
      console.log(
        `   Choix: ${choices.length > 0 ? choices.join(", ") : "Aucun cookie optionnel"}`
      )
      console.log("")
    })

    // Test 2: Statistiques globales
    console.log("📋 Test 2: Statistiques globales")
    const stats = await client.fetch(
      `
      {
        "total": count(*[_type == "consentStats"]),
        "expired": count(*[_type == "consentStats" && expiresAt < $now]),
        "analytics": count(*[_type == "consentStats" && consentChoices.analytics == true]),
        "marketing": count(*[_type == "consentStats" && consentChoices.marketing == true])
      }
    `,
      { now: new Date().toISOString() }
    )

    console.log(`📈 Total: ${stats.total} consentements`)
    console.log(`⏰ Expirés: ${stats.expired} consentements`)
    console.log(`📊 Analytics acceptés: ${stats.analytics}`)
    console.log(`🎯 Marketing acceptés: ${stats.marketing}`)

    console.log("\n✅ Test terminé")
  } catch (error) {
    console.error("❌ Erreur lors du test:", error)
  }
}

testConsentSystem()
