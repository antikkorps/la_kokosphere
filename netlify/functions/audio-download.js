import { AUDIOS, parseRequest } from "../lib/audios.js"
import { upsertContact } from "../lib/brevo.js"
import { signedDownloadUrl } from "../lib/r2.js"

const headers = { "Content-Type": "application/json" }

function reply(statusCode, payload) {
  return { statusCode, headers, body: JSON.stringify(payload) }
}

function listIdsFor(request, env) {
  const ids = [env[AUDIOS[request.audio].listEnv]]
  if (request.newsletter) ids.push(env.BREVO_LIST_ID)
  return ids.filter(Boolean).map((id) => parseInt(id, 10))
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return reply(405, { error: "Method Not Allowed" })

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return reply(400, { error: "JSON invalide" })
  }

  const request = parseRequest(body)
  // Un robot ne doit pas apprendre qu'il a été repéré.
  if (request.bot) return reply(200, {})
  if (!request.ok) return reply(400, { error: "Prénom, email ou audio invalide" })

  const env = process.env
  try {
    await upsertContact({ ...request, listIds: listIdsFor(request, env) }, env.BREVO_API_KEY)
  } catch (error) {
    // Le visiteur a rempli sa part : une panne Brevo ne doit pas le priver de l'audio.
    console.error("Inscription Brevo échouée :", error)
  }

  try {
    return reply(200, { url: await signedDownloadUrl(AUDIOS[request.audio], env) })
  } catch (error) {
    console.error("Signature R2 échouée :", error)
    return reply(500, { error: "Téléchargement indisponible" })
  }
}
