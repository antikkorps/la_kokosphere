import https from "https"

export const handler = async (event, context) => {
  const { code } = event.queryStringParameters || {}

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No authorization code provided" }),
    }
  }

  try {
    // Échanger le code contre un token
    const tokenResponse = await exchangeCodeForToken(code, event)

    console.log("Token response:", JSON.stringify(tokenResponse, null, 2))

    // Rediriger vers le dashboard Decap CMS avec le token
    return {
      statusCode: 302,
      headers: {
        Location: "/admin/dashboard",
        "Set-Cookie": `auth0_token=${tokenResponse.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      },
    }
  } catch (error) {
    console.error("Auth callback error:", error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Authentication failed", details: error.message }),
    }
  }
}

async function exchangeCodeForToken(code, event) {
  const auth0Domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_CLIENT_ID
  const clientSecret = process.env.AUTH0_CLIENT_SECRET
  const redirectUri = `https://${event.headers.host}/.netlify/functions/auth0-callback`

  console.log("Auth0 config:", {
    domain: auth0Domain,
    clientId: clientId,
    redirectUri: redirectUri,
    hasSecret: !!clientSecret,
  })

  const postData = JSON.stringify({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
  })

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: auth0Domain,
        path: "/oauth/token",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => {
          console.log("Auth0 response status:", res.statusCode)
          console.log("Auth0 response data:", data)

          try {
            const parsedData = JSON.parse(data)
            if (res.statusCode !== 200) {
              reject(
                new Error(
                  `Auth0 error: ${parsedData.error_description || parsedData.error}`
                )
              )
            } else {
              resolve(parsedData)
            }
          } catch (e) {
            reject(e)
          }
        })
      }
    )

    req.on("error", reject)
    req.write(postData)
    req.end()
  })
}
