import { createRemoteJWKSet, jwtVerify } from "jose"

export const verifyAuth0Token = async (request) => {
  const authorization = request.headers.get("Authorization") ?? ""
  const [type, token, ...parts] = authorization.replace(/\s+/g, " ").trim().split(" ")

  if (type !== "Bearer" || parts.length !== 0) {
    throw new Error("Missing or invalid Authorization header")
  }

  const JWKS = createRemoteJWKSet(
    new URL(".well-known/jwks.json", process.env.AUTH0_ISSUER)
  )

  const result = await jwtVerify(token, JWKS, {
    issuer: process.env.AUTH0_ISSUER,
    audience: process.env.AUTH0_AUDIENCE,
  })

  return { token, result }
}
