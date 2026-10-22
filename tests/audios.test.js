import { test } from "node:test"
import assert from "node:assert/strict"
import { loadPages } from "./helpers.js"

/**
 * Chaque audio a sa page : un formulaire qui disparaît, ou qui demande l'audio
 * de l'autre public, ne casse pas le build mais fausse la liste Brevo concernée.
 */
test("l'accueil et /entreprise publient chacun le formulaire de leur audio", () => {
  const forms = loadPages().flatMap((page) =>
    page.dom.querySelectorAll("form[data-audio-gate]").map((form) => [page.url, form.getAttribute("data-audio-gate")])
  )
  assert.deepEqual(forms, [
    ["/", "flux-mental"],
    ["/entreprise/", "regeneration"],
  ])
})

// Durées arrondies des fichiers du bucket R2 : flux-mental.m4a dure 6 min 16,
// regeneration.m4a 2 min 54. À revoir si Cécile remplace un fichier.
const DUREES = { "/": "6 minutes", "/entreprise/": "3 minutes" }

for (const [url, duree] of Object.entries(DUREES)) {
  test(`le formulaire d'audio de ${url} annonce ${duree}`, () => {
    const page = loadPages().find((p) => p.url === url)
    const section = page.dom.querySelector("form[data-audio-gate]").closest("section")
    assert.match(section.textContent, new RegExp(`\\b${duree}\\b`))
  })
}
