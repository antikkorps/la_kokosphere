import { verifyAuth0Token } from "../lib/auth.js"

export const handler = async (event, context) => {
  // Vérifier si le cookie auth0_token existe
  const cookies = event.headers.cookie || ""
  const auth0Token = cookies.split(";").find((c) => c.trim().startsWith("auth0_token="))

  if (!auth0Token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ authenticated: false }),
    }
  }

  // Extraire le token
  const token = auth0Token.split("=")[1]

  try {
    // Convertir l'event Netlify en Request pour la fonction verifyAuth0Token
    const request = new Request(`https://${event.headers.host}${event.path}`, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        Authorization: `Bearer ${token}`,
      },
      body: event.body,
    })

    // Vérifier la validité du token JWT Auth0
    const authResult = await verifyAuth0Token(request)

    return {
      statusCode: 200,
      body: JSON.stringify({
        authenticated: true,
        user: authResult.result.payload,
      }),
    }
  } catch (error) {
    console.error("Auth check error:", error)
    // Token invalide, supprimer le cookie
    return {
      statusCode: 401,
      headers: {
        "Set-Cookie": "auth0_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      },
      body: JSON.stringify({ authenticated: false }),
    }
  }
}
