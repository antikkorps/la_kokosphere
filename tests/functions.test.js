import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync } from "node:fs"

/**
 * Les fonctions Netlify ne passent pas par le build Astro : on les vérifie à la
 * source. Le package déclare "type": "module", donc un fichier .js écrit en
 * CommonJS ne se charge pas. Depuis fin septembre 2026, Netlify refuse de les
 * bundler, ce qui fait échouer tous les déploiements, prod comprise.
 */

const dir = new URL("../netlify/functions/", import.meta.url)
const files = readdirSync(dir).filter((file) => file.endsWith(".js"))

// Sans fonction trouvée, la boucle n'enregistrerait aucun test et passerait à vide.
test("le dossier des fonctions Netlify en contient", () => {
  assert.ok(files.length > 0, `aucune fonction dans ${dir.pathname}`)
})

for (const file of files) {
  test(`la fonction ${file} se charge en ESM et exporte un handler`, async () => {
    const mod = await import(new URL(file, dir))
    assert.equal(typeof mod.handler, "function")
  })
}
