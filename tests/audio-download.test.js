import { test, describe, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import { AUDIOS, parseRequest } from "../netlify/lib/audios.js"
import { upsertContact } from "../netlify/lib/brevo.js"
import { signedDownloadUrl } from "../netlify/lib/r2.js"
import { handler } from "../netlify/functions/audio-download.js"

/**
 * Audios offerts en échange d'un email. Le bucket R2 reste privé : seule la
 * fonction délivre une URL signée, de courte durée, une fois le contact
 * enregistré dans Brevo. Aucun appel réseau réel, fetch est remplacé.
 */

const ENV = {
  R2_ACCOUNT_ID: "compte",
  R2_ACCESS_KEY_ID: "cle",
  R2_SECRET_ACCESS_KEY: "secret",
  R2_BUCKET: "audios",
  BREVO_API_KEY: "brevo",
  BREVO_LIST_ID: "1",
  BREVO_LIST_AUDIO_FLUX_MENTAL: "7",
  BREVO_LIST_AUDIO_REGENERATION: "8",
}

const valid = { prenom: "Léa", email: "lea@example.com", audio: "flux-mental" }

describe("parseRequest", () => {
  test("accepte une demande complète, newsletter non cochée par défaut", () => {
    const result = parseRequest(valid)
    assert.deepEqual(result, { ok: true, prenom: "Léa", email: "lea@example.com", audio: "flux-mental", newsletter: false })
  })

  for (const [champ, valeur] of [["prenom", " "], ["email", "pas-un-email"], ["audio", "inconnu"]]) {
    test(`refuse un champ ${champ} invalide`, () => {
      assert.equal(parseRequest({ ...valid, [champ]: valeur }).ok, false)
    })
  }

  test("signale un robot qui remplit le champ piège", () => {
    assert.equal(parseRequest({ ...valid, website: "http://spam" }).bot, true)
  })
})

describe("signedDownloadUrl", () => {
  test("signe une URL R2 de quinze minutes qui force le téléchargement", async () => {
    const url = new URL(await signedDownloadUrl({ key: "flux-mental.mp3", filename: "pause.mp3" }, ENV))
    assert.equal(url.host, "compte.r2.cloudflarestorage.com")
    assert.equal(url.pathname, "/audios/flux-mental.mp3")
    assert.equal(url.searchParams.get("X-Amz-Expires"), "900")
    assert.equal(url.searchParams.get("response-content-disposition"), 'attachment;filename="pause.mp3"')
    assert.match(url.searchParams.get("X-Amz-Signature"), /^[0-9a-f]{64}$/)
  })

  // aws4fetch signe la forme %20, mais URLSearchParams réécrit l'espace en « + » :
  // R2 recalculerait alors une autre signature et répondrait 403.
  test("ne produit aucun « + » dans la query signée", async () => {
    const url = await signedDownloadUrl(AUDIOS["flux-mental"], ENV)
    assert.ok(!new URL(url).search.includes("+"), url)
  })

  test("refuse de signer si une variable R2 manque", async () => {
    await assert.rejects(signedDownloadUrl(AUDIOS["flux-mental"], { ...ENV, R2_BUCKET: "" }))
  })

  test("les noms de fichiers ne peuvent pas casser l'en-tête Content-Disposition", () => {
    for (const { filename } of Object.values(AUDIOS)) assert.match(filename, /^[\w.-]+$/)
  })
})

describe("upsertContact", () => {
  const realFetch = globalThis.fetch
  afterEach(() => { globalThis.fetch = realFetch })

  test("abandonne un appel Brevo qui ne répond pas", { timeout: 1000 }, async () => {
    // Sans signal d'annulation, cette promesse ne se résout jamais. Le timer
    // tient lieu de socket ouverte : celui d'AbortSignal.timeout ne retient
    // pas la boucle, et Node 22 l'arrêterait avant l'annulation.
    globalThis.fetch = (url, init) =>
      new Promise((_, reject) => {
        const socket = setInterval(() => {}, 1000)
        init.signal?.addEventListener("abort", () => {
          clearInterval(socket)
          reject(init.signal.reason)
        })
      })
    await assert.rejects(upsertContact({ email: "a@b.fr", prenom: "A", listIds: [1] }, "cle", 20))
  })
})

describe("handler audio-download", () => {
  let calls
  const realFetch = globalThis.fetch
  const realEnv = { ...process.env }

  function post(body) {
    return handler({ httpMethod: "POST", body: JSON.stringify(body) })
  }

  function stubBrevo(status) {
    globalThis.fetch = async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) })
      return new Response(status < 300 ? "" : '{"message":"ko"}', { status })
    }
  }

  beforeEach(() => {
    calls = []
    Object.assign(process.env, ENV)
    stubBrevo(201)
  })

  afterEach(() => {
    globalThis.fetch = realFetch
    process.env = { ...realEnv }
  })

  test("refuse autre chose qu'un POST", async () => {
    assert.equal((await handler({ httpMethod: "GET" })).statusCode, 405)
  })

  test("refuse un corps qui n'est pas du JSON", async () => {
    assert.equal((await handler({ httpMethod: "POST", body: "{" })).statusCode, 400)
  })

  test("répond 500 si R2 n'est pas configuré", async () => {
    delete process.env.R2_ACCOUNT_ID
    assert.equal((await post(valid)).statusCode, 500)
  })

  test("refuse une demande invalide sans appeler Brevo", async () => {
    assert.equal((await post({ ...valid, email: "x" })).statusCode, 400)
    assert.equal(calls.length, 0)
  })

  test("inscrit le contact dans la liste de l'audio et renvoie l'URL signée", async () => {
    const response = await post(valid)
    assert.equal(response.statusCode, 200)
    assert.match(JSON.parse(response.body).url, /^https:\/\/compte\.r2\.cloudflarestorage\.com\/audios\//)
    assert.deepEqual(calls[0].body, {
      email: "lea@example.com",
      attributes: { PRENOM: "Léa" },
      listIds: [7],
      updateEnabled: true,
    })
  })

  test("n'ajoute à la newsletter que si la case est cochée", async () => {
    await post({ ...valid, audio: "regeneration", newsletter: true })
    assert.deepEqual(calls[0].body.listIds, [8, 1])
  })

  test("livre l'audio même si Brevo est en panne", async () => {
    stubBrevo(500)
    const response = await post(valid)
    assert.equal(response.statusCode, 200)
    assert.ok(JSON.parse(response.body).url)
  })

  test("répond comme un succès à un robot, sans lien ni appel Brevo", async () => {
    const response = await post({ ...valid, website: "spam" })
    assert.equal(response.statusCode, 200)
    assert.equal(JSON.parse(response.body).url, undefined)
    assert.equal(calls.length, 0)
  })
})
