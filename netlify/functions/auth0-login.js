const { Auth0Client } = require("@auth0/auth0-spa-js")

exports.handler = async (event, context) => {
  // Rediriger vers Auth0 pour l'authentification
  const auth0 = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN,
    client_id: process.env.AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: `${event.headers.host}/.netlify/functions/auth0-callback`,
    },
  })

  const loginUrl = await auth0.buildAuthorizeUrl()

  return {
    statusCode: 302,
    headers: {
      Location: loginUrl,
    },
  }
}
