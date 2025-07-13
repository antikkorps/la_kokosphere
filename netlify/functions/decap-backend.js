import { verifyAuth0Token } from "../lib/auth.js"

export const handler = async (event, context) => {
  // Convertir l'event Netlify en Request pour la fonction verifyAuth0Token
  const request = new Request(`https://${event.headers.host}${event.path}`, {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body,
  })

  try {
    // Vérifier le token Auth0
    const authResult = await verifyAuth0Token(request)
    console.log("Auth successful for user:", authResult.result.payload.sub)

    // L'utilisateur est authentifié, rediriger vers Git Gateway
    return await proxyToGitGateway(event)
  } catch (error) {
    console.error("Auth error:", error)
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Authorization required" }),
    }
  }
}

async function proxyToGitGateway(event) {
  // Pour l'instant, on simule une réponse Git Gateway
  // En production, on ferait un vrai proxy vers l'API Git Gateway de Netlify

  const path = event.path.replace("/.netlify/functions/decap-backend", "")

  if (path === "/auth") {
    // Réponse d'authentification
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "auth0-authenticated-token",
      }),
    }
  }

  // Pour les autres requêtes, on simule une réponse Git Gateway
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Git Gateway proxy - authenticated via Auth0",
    }),
  }
}
