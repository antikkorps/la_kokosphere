export const handler = async (event, context) => {
  // Construire l'URL d'autorisation Auth0
  const auth0Domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_CLIENT_ID
  const redirectUri = `https://${event.headers.host}/.netlify/functions/auth0-callback`

  const authUrl =
    `https://${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid%20profile%20email&` +
    `state=${Math.random().toString(36).substring(7)}`

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
  }
}
