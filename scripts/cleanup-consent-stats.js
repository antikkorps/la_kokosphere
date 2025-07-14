import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Token avec permissions d'écriture
})

async function cleanupConsentStats() {
  console.log("🧹 Nettoyage des données de consentement expirées...\n")

  try {
    // Récupérer tous les consentements expirés
    const expiredConsents = await client.fetch(
      `
      *[_type == "consentStats" && expiresAt < $now] {
        _id,
        date,
        expiresAt,
        method,
        "choices": consentChoices
      }
    `,
      { now: new Date().toISOString() }
    )

    console.log(`📊 ${expiredConsents.length} consentements expirés trouvés\n`)

    if (expiredConsents.length === 0) {
      console.log("✅ Aucun consentement à supprimer")
      return
    }

    // Afficher les détails avant suppression
    expiredConsents.forEach((consent, index) => {
      const consentDate = new Date(consent.date).toLocaleDateString("fr-FR")
      const expiryDate = new Date(consent.expiresAt).toLocaleDateString("fr-FR")
      const choices = []
      if (consent.choices.analytics) choices.push("Analytics")
      if (consent.choices.marketing) choices.push("Marketing")

      console.log(
        `${index + 1}. Consentement du ${consentDate} (expiré le ${expiryDate})`
      )
      console.log(`   Méthode: ${consent.method}`)
      console.log(
        `   Choix: ${choices.length > 0 ? choices.join(", ") : "Aucun cookie optionnel"}`
      )
    })

    // Demander confirmation (en mode interactif)
    if (process.env.NODE_ENV !== "production") {
      console.log("\n⚠️  Mode développement - suppression simulée")
      console.log("En production, utilisez NODE_ENV=production pour supprimer réellement")
      return
    }

    // Supprimer les consentements expirés
    console.log("\n🗑️  Suppression des consentements expirés...")

    for (const consent of expiredConsents) {
      await client.delete(consent._id)
      console.log(`✅ Supprimé: ${consent._id}`)
    }

    console.log(
      `\n🎉 Nettoyage terminé ! ${expiredConsents.length} consentements supprimés`
    )

    // Statistiques finales
    const remainingConsents = await client.fetch(`
      count(*[_type == "consentStats"])
    `)

    console.log(`📊 ${remainingConsents} consentements restants dans la base`)
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error)
  }
}

// Fonction pour afficher les statistiques actuelles
async function showConsentStats() {
  console.log("📊 Statistiques des consentements...\n")

  try {
    const stats = await client.fetch(
      `
      {
        "total": count(*[_type == "consentStats"]),
        "expired": count(*[_type == "consentStats" && expiresAt < $now]),
        "analytics": count(*[_type == "consentStats" && consentChoices.analytics == true]),
        "marketing": count(*[_type == "consentStats" && consentChoices.marketing == true]),
        "recent": count(*[_type == "consentStats" && date > $lastMonth])
      }
    `,
      {
        now: new Date().toISOString(),
        lastMonth: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
    )

    console.log(`📈 Total: ${stats.total} consentements`)
    console.log(`⏰ Expirés: ${stats.expired} consentements`)
    console.log(`📊 Analytics acceptés: ${stats.analytics}`)
    console.log(`🎯 Marketing acceptés: ${stats.marketing}`)
    console.log(`📅 Dernier mois: ${stats.recent} consentements`)
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error)
  }
}

// Exécuter selon l'argument
const action = process.argv[2]

if (action === "stats") {
  showConsentStats()
} else {
  cleanupConsentStats()
}
