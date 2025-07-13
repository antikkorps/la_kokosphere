const { Auth0Client } = require("@auth0/auth0-spa-js")

exports.handler = async (event, context) => {
  const auth0 = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN,
    client_id: process.env.AUTH0_CLIENT_ID,
  })

  try {
    // Traiter le callback Auth0
    await auth0.handleRedirectCallback(event.rawUrl)

    // Rediriger vers Decap CMS
    return {
      statusCode: 302,
      headers: {
        Location: "/admin",
        "Set-Cookie": `auth0_token=${await auth0.getTokenSilently()}; Path=/; HttpOnly; Secure`,
      },
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Authentication failed" }),
    }
  }
}
