import { test } from "node:test"
import assert from "node:assert/strict"
import { loadPages } from "./helpers.js"

/**
 * Les formulaires d'audio sont en ligne depuis le 21 octobre 2026, mais le
 * bucket R2 n'existe pas encore : un visiteur était inscrit dans Brevo puis
 * recevait une erreur au lieu de l'audio. Ils restent masqués jusqu'à ce que
 * R2 soit configuré. Passer alors AUDIOS_EN_LIGNE à true et retirer ce test.
 */
test("aucun formulaire d'audio n'est publié tant que R2 n'est pas prêt", () => {
  const pages = loadPages().filter((page) => page.dom.querySelector("form[data-audio-gate]"))
  assert.deepEqual(pages.map((page) => page.url), [])
})
