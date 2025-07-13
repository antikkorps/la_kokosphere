import https from "https"

export const handler = async (event, context) => {
  console.log("check-auth called")

  // Vérifier si le cookie auth0_token existe
  const cookies = event.headers.cookie || ""
  const auth0Token = cookies.split(";").find((c) => c.trim().startsWith("auth0_token="))

  console.log("Cookies:", cookies)
  console.log("Auth0 token found:", !!auth0Token)

  if (!auth0Token) {
    console.log("No auth0_token cookie found")
    return {
      statusCode: 401,
      body: JSON.stringify({ authenticated: false, error: "No token cookie" }),
    }
  }

  // Extraire le token
  const token = auth0Token.split("=")[1]
  console.log("Token extracted:", token ? "present" : "missing")

  if (!token || token === "undefined") {
    console.log("Token is undefined or missing")
    return {
      statusCode: 401,
      body: JSON.stringify({ authenticated: false, error: "Invalid token" }),
    }
  }

  try {
    // Vérifier la validité du token auprès d'Auth0
    const userInfo = await getUserInfo(token)
    console.log("User info retrieved:", userInfo.sub)

    return {
      statusCode: 200,
      body: JSON.stringify({
        authenticated: true,
        user: userInfo,
      }),
    }
  } catch (error) {
    console.error("Auth check error:", error.message)
    // Token invalide, supprimer le cookie
    return {
      statusCode: 401,
      headers: {
        "Set-Cookie": "auth0_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      },
      body: JSON.stringify({ authenticated: false, error: error.message }),
    }
  }
}

async function getUserInfo(token) {
  const auth0Domain = process.env.AUTH0_DOMAIN
  console.log("Auth0 domain:", auth0Domain)

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
          console.log("Auth0 userinfo response status:", res.statusCode)
          console.log("Auth0 userinfo response data:", data)

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
