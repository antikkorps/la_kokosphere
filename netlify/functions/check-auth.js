import https from "https"

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
    // Vérifier la validité du token auprès d'Auth0
    const userInfo = await getUserInfo(token)

    return {
      statusCode: 200,
      body: JSON.stringify({
        authenticated: true,
        user: userInfo,
      }),
    }
  } catch (error) {
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

async function getUserInfo(token) {
  const auth0Domain = process.env.AUTH0_DOMAIN

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: auth0Domain,
        path: "/userinfo",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data))
            } catch (e) {
              reject(e)
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`))
          }
        })
      }
    )

    req.on("error", reject)
    req.end()
  })
}
