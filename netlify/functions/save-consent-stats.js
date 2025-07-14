const { Octokit } = require("@octokit/rest")

exports.handler = async function (event, context) {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    // Parser les données de consentement
    const consentData = JSON.parse(event.body)

    // Initialiser Octokit avec le token GitHub
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })

    const owner = "franck-berthier"
    const repo = "la-kokosphere"
    const path = "src/content/consent-stats/consent-stats.md"

    // Créer le contenu du fichier
    const content = `---
date: ${new Date().toISOString()}
analytics: ${consentData.analytics || false}
marketing: ${consentData.marketing || false}
necessary: ${consentData.necessary || true}
ip: ${consentData.ip || "unknown"}
userAgent: ${consentData.userAgent || "unknown"}
---

# Statistiques de consentement

- **Date** : ${new Date().toLocaleString("fr-FR")}
- **Analytics** : ${consentData.analytics ? "Accepté" : "Refusé"}
- **Marketing** : ${consentData.marketing ? "Accepté" : "Refusé"}
- **Nécessaire** : ${consentData.necessary ? "Accepté" : "Refusé"}
- **IP** : ${consentData.ip || "Non disponible"}
- **User Agent** : ${consentData.userAgent || "Non disponible"}

## Détails

Consentement enregistré le ${new Date().toLocaleString("fr-FR")} pour l'adresse IP ${
      consentData.ip || "inconnue"
    }.
`

    // Encoder le contenu en base64
    const contentBase64 = Buffer.from(content).toString("base64")

    // Créer un nom de fichier unique avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `consent-${timestamp}.md`
    const filePath = `src/content/consent-stats/${filename}`

    // Créer le fichier dans le repository
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Ajout statistiques consentement - ${new Date().toLocaleString("fr-FR")}`,
      content: contentBase64,
      branch: "main",
    })

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        success: true,
        message: "Statistiques de consentement sauvegardées",
        file: filename,
      }),
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des statistiques:", error)

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        success: false,
        error: "Erreur lors de la sauvegarde des statistiques",
      }),
    }
  }
}
