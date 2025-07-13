import https from "https"

export const handler = async (event, context) => {
  // Vérifier si l'utilisateur est authentifié
  const cookies = event.headers.cookie || ""
  const auth0Token = cookies.split(";").find((c) => c.trim().startsWith("auth0_token="))

  if (!auth0Token) {
    return {
      statusCode: 302,
      headers: {
        Location: "/admin",
      },
    }
  }

  const token = auth0Token.split("=")[1]

  if (!token || token === "undefined") {
    return {
      statusCode: 302,
      headers: {
        Location: "/admin",
      },
    }
  }

  try {
    // Vérifier la validité du token auprès d'Auth0
    const userInfo = await getUserInfo(token)
    console.log("Dashboard access granted for user:", userInfo.sub)

    // L'utilisateur est authentifié, servir la page dashboard
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Decap CMS - Dashboard</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
      `,
    }
  } catch (error) {
    console.error("Dashboard auth error:", error.message)
    // Token invalide, rediriger vers la page de connexion
    return {
      statusCode: 302,
      headers: {
        Location: "/admin",
        "Set-Cookie": "auth0_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      },
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
