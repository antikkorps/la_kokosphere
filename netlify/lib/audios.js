/**
 * Audios offerts contre un email. `key` est le nom de l'objet dans le bucket R2,
 * `listEnv` la variable d'environnement qui porte l'id de la liste Brevo propre
 * à l'audio, pour que Cécile distingue les particuliers des entreprises.
 */
export const AUDIOS = {
  "flux-mental": {
    key: "flux-mental.m4a",
    filename: "La-Kokosphere-pause-micro-recuperation.m4a",
    listEnv: "BREVO_LIST_AUDIO_FLUX_MENTAL",
  },
  regeneration: {
    key: "regeneration.m4a",
    filename: "La-Kokosphere-pause-regeneration.m4a",
    listEnv: "BREVO_LIST_AUDIO_REGENERATION",
  },
}

// Volontairement permissif : Brevo refusera de lui-même une adresse impossible.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Valide le corps de la requête. `website` est un champ caché que seuls les
 * robots remplissent.
 */
export function parseRequest(body) {
  if (body?.website) return { ok: false, bot: true }

  const prenom = String(body?.prenom ?? "").trim()
  const email = String(body?.email ?? "").trim().toLowerCase()
  const audio = String(body?.audio ?? "")

  if (!prenom || prenom.length > 80 || !EMAIL.test(email) || !Object.hasOwn(AUDIOS, audio)) {
    return { ok: false }
  }
  return { ok: true, prenom, email, audio, newsletter: body.newsletter === true }
}
