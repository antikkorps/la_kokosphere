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
