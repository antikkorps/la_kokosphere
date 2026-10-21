/**
 * Crée ou met à jour un contact Brevo. PRENOM est l'attribut par défaut d'un
 * compte Brevo français.
 */
export async function upsertContact({ email, prenom, listIds }, apiKey, timeoutMs = 3000) {
  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    // Un Brevo qui ne répond plus ne doit pas retenir le téléchargement.
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({ email, attributes: { PRENOM: prenom }, listIds, updateEnabled: true }),
  })

  if (!response.ok) {
    throw new Error(`Brevo ${response.status}: ${await response.text()}`)
  }
}
