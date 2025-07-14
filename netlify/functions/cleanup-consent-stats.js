import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

export async function handler(event, context) {
  // Vérifier que c'est un appel autorisé (cron job ou webhook)
  const authHeader = event.headers.authorization
  const isAuthorized =
    authHeader === `Bearer ${process.env.CLEANUP_SECRET}` ||
    event.headers["x-webhook-secret"] === process.env.CLEANUP_SECRET

  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Non autorisé" }),
    }
  }

  try {
    console.log("🧹 Début du nettoyage des consentements expirés...")

    // Récupérer les consentements expirés
    const expiredConsents = await client.fetch(
      `
      *[_type == "consentStats" && expiresAt < $now] {
        _id,
        date,
        expiresAt
      }
    `,
      { now: new Date().toISOString() }
    )

    console.log(`📊 ${expiredConsents.length} consentements expirés trouvés`)

    if (expiredConsents.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Aucun consentement à supprimer",
          deleted: 0,
        }),
      }
    }

    // Supprimer les consentements expirés
    let deletedCount = 0
    for (const consent of expiredConsents) {
      try {
        await client.delete(consent._id)
        deletedCount++
        console.log(`✅ Supprimé: ${consent._id}`)
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${consent._id}:`, error)
      }
    }

    // Statistiques finales
    const remainingCount = await client.fetch(`
      count(*[_type == "consentStats"])
    `)

    console.log(`🎉 Nettoyage terminé: ${deletedCount} consentements supprimés`)
    console.log(`📊 ${remainingCount} consentements restants`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Nettoyage terminé avec succès",
        deleted: deletedCount,
        remaining: remainingCount,
        timestamp: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erreur lors du nettoyage",
        message: error.message,
      }),
    }
  }
}
