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
    const tokenResponse = await exchangeCodeForToken(code)

    // Rediriger vers Decap CMS avec le token
    return {
      statusCode: 302,
      headers: {
        Location: "/admin",
        "Set-Cookie": `auth0_token=${tokenResponse.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      },
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Authentication failed" }),
    }
  }
}

async function exchangeCodeForToken(code) {
  const auth0Domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_CLIENT_ID
  const clientSecret = process.env.AUTH0_CLIENT_SECRET
  const redirectUri = `https://${process.env.URL}/.netlify/functions/auth0-callback`

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
          try {
            resolve(JSON.parse(data))
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
