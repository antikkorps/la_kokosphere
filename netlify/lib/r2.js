import { AwsV4Signer } from "aws4fetch"

// Assez long pour un téléchargement lent, assez court pour qu'un lien partagé
// ne serve pas de porte dérobée au formulaire.
const EXPIRES_SECONDS = 900

const REQUIRED = ["R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]

/** URL GET présignée sur un objet du bucket R2 privé. */
export async function signedDownloadUrl({ key, filename }, env) {
  const missing = REQUIRED.filter((name) => !env[name])
  if (missing.length) throw new Error(`Variables R2 manquantes : ${missing.join(", ")}`)

  const url = new URL(
    `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}/${encodeURIComponent(key)}`
  )
  url.searchParams.set("X-Amz-Expires", String(EXPIRES_SECONDS))
  // Sans cet en-tête, le navigateur lirait l'audio dans un onglet au lieu de l'enregistrer.
  // Pas d'espace après le « ; » : URLSearchParams l'écrirait « + », alors que la
  // signature est calculée sur « %20 », et R2 répondrait 403.
  url.searchParams.set("response-content-disposition", `attachment;filename="${filename}"`)

  const signer = new AwsV4Signer({
    url,
    method: "GET",
    service: "s3",
    region: "auto",
    signQuery: true,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  })
  const { url: signed } = await signer.sign()
  return signed.toString()
}
