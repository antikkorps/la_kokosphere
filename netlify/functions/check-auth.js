exports.handler = async (event, context) => {
  // Vérifier si le cookie auth0_token existe
  const cookies = event.headers.cookie || ""
  const auth0Token = cookies.split(";").find((c) => c.trim().startsWith("auth0_token="))

  if (auth0Token) {
    return {
      statusCode: 200,
      body: JSON.stringify({ authenticated: true }),
    }
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ authenticated: false }),
  }
}
