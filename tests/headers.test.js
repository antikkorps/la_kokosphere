import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { readDistFile } from "./helpers.js"

/**
 * En-têtes servis par Netlify, qui fusionne dist/_headers et les blocs
 * [[headers]] de netlify.toml. Défaut constaté en octobre 2026 : une règle
 * `/*` mettait toutes les pages HTML en cache un an, `immutable` compris. Un
 * visiteur revenu sur le site ne voyait plus aucune mise à jour.
 */

function toRegExp(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")
  return new RegExp(`^${escaped}$`)
}

function rulesFromHeadersFile(text) {
  const rules = []
  for (const line of text.split("\n")) {
    if (/^\S/.test(line) && !line.startsWith("#")) rules.push({ pattern: line.trim(), cacheControl: [] })
    const match = line.match(/^\s+Cache-Control:\s*(.+)$/i)
    if (match && rules.length) rules.at(-1).cacheControl.push(match[1].trim())
  }
  return rules
}

function rulesFromNetlifyToml(text) {
  return text.split("[[headers]]").slice(1).map((block) => ({
    pattern: block.match(/for\s*=\s*"([^"]+)"/)[1],
    cacheControl: [...block.matchAll(/Cache-Control\s*=\s*"([^"]+)"/gi)].map((m) => m[1]),
  }))
}

const rules = [
  ...rulesFromHeadersFile(readDistFile("_headers")),
  ...rulesFromNetlifyToml(readFileSync(new URL("../netlify.toml", import.meta.url), "utf8")),
]

function cacheControlFor(path) {
  return rules.filter((rule) => toRegExp(rule.pattern).test(path)).flatMap((rule) => rule.cacheControl)
}

for (const path of ["/", "/entreprise/", "/blog/", "/blog/un-article/"]) {
  test(`la page ${path} n'est pas mise en cache durablement`, () => {
    for (const value of cacheControlFor(path)) {
      assert.doesNotMatch(value, /immutable|max-age=\d{5,}/, `règle trouvée : ${value}`)
    }
  })
}

test("les fichiers d'Astro, nommés par leur contenu, restent en cache un an", () => {
  assert.ok(cacheControlFor("/_astro/index.abc123.css").some((value) => value.includes("immutable")))
})
