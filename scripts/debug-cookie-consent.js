import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function debugCookieConsent() {
  console.log("🔍 Debug du système de consentement cookies...\n")

  try {
    // Test 1: Vérifier la connexion à Sanity
    console.log("📋 Test 1: Connexion à Sanity")
    const testQuery = await client.fetch(`count(*[_type == "service"])`)
    console.log(`✅ Connexion OK - ${testQuery} services trouvés\n`)

    // Test 2: Vérifier les consentements existants
    console.log("📋 Test 2: Consentements existants")
    const existingConsents = await client.fetch(`
      *[_type == "consentStats"] | order(date desc)[0...5] {
        _id,
        date,
        method,
        "choices": consentChoices
      }
    `)

    console.log(`📊 ${existingConsents.length} consentements existants\n`)

    // Test 3: Tenter de créer un consentement de test
    console.log("📋 Test 3: Création d'un consentement de test")

    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 6)

    const testConsent = {
      _type: "consentStats",
      date: new Date().toISOString(),
      ip: "debug-test",
      userAgent: "debug-test",
      method: "debug",
      consentChoices: {
        necessary: true,
        analytics: true,
        marketing: false,
      },
      expiresAt: expiresAt.toISOString(),
    }

    try {
      const result = await client.create(testConsent)
      console.log("✅ Consentement de test créé avec succès !")
      console.log("ID:", result._id)
      console.log("Date:", new Date(result.date).toLocaleDateString("fr-FR"))

      // Supprimer le test
      await client.delete(result._id)
      console.log("🗑️  Document de test supprimé\n")
    } catch (createError) {
      console.error("❌ Erreur lors de la création:", createError.message)

      if (createError.message.includes("Unknown document type")) {
        console.log("💡 Le schéma 'consentStats' n'est pas reconnu")
        console.log("   Vérifiez que Sanity Studio est redémarré")
      } else if (createError.message.includes("token")) {
        console.log("💡 Problème de token - vérifiez SANITY_TOKEN")
      }
    }

    // Test 4: Vérifier les variables d'environnement
    console.log("📋 Test 4: Variables d'environnement")
    console.log("SANITY_TOKEN:", process.env.SANITY_TOKEN ? "✅ Présent" : "❌ Manquant")
    console.log("NODE_ENV:", process.env.NODE_ENV || "non défini")
  } catch (error) {
    console.error("❌ Erreur générale:", error)
  }
}

debugCookieConsent()
