import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { DIST, loadPages, readDistFile } from "./helpers.js"

/**
 * Content-Security-Policy servie par Netlify. Défaut constaté en octobre 2026 :
 * deux CSP coexistaient, une complète dans public/_headers et une minimale dans
 * netlify.toml, et seule la seconde était servie. On corrigeait l'une en
 * croyant protéger le site avec l'autre.
 */

const netlifyToml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8")
const tomlPolicies = [...netlifyToml.matchAll(/^\s*Content-Security-Policy\s*=\s*"([^"]+)"/gim)].map((m) => m[1])

function parsePolicy(policy) {
  const directives = new Map()
  for (const part of policy.split(";").map((p) => p.trim()).filter(Boolean)) {
    const [name, ...sources] = part.split(/\s+/)
    directives.set(name, sources)
  }
  return directives
}

const directives = parsePolicy(tomlPolicies[0] ?? "")

function sourcesFor(directives, name) {
  return directives.get(name) ?? directives.get("default-src") ?? []
}

const SELF = "https://la-kokosphere.invalid"

/** Une URL relative relève de 'self' ; une absolue, y compris //hôte, de son origine. */
function isAllowed(name, url) {
  const sources = sourcesFor(directives, name)
  if (url.startsWith("data:")) return sources.includes("data:")
  const { origin } = new URL(url, SELF)
  return origin === SELF ? sources.includes("'self'") : sources.includes(origin)
}

function srcsetUrls(srcset) {
  return srcset.split(",").map((entry) => entry.trim().split(/\s+/)[0]).filter(Boolean)
}

/** Chaque ressource chargée par une page, avec la directive qui la gouverne. */
function pageLoads(page) {
  const all = (selector, attr) => page.dom.querySelectorAll(selector).map((el) => el.getAttribute(attr))
  return [
    ...all("img[src]", "src").map((url) => ["img-src", url]),
    ...all("img[srcset]", "srcset").flatMap(srcsetUrls).map((url) => ["img-src", url]),
    ...all("script[src]", "src").map((url) => ["script-src", url]),
    ...all('link[rel="stylesheet"]', "href").map((url) => ["style-src", url]),
    ...all("iframe[src]", "src").map((url) => ["frame-src", url]),
    // Le widget Calendly crée son iframe à partir de cet attribut.
    ...all(".calendly-inline-widget[data-url]", "data-url").map((url) => ["frame-src", url]),
  ].map(([directive, url]) => ({ directive, url, where: page.url }))
}

function cssImports() {
  const dir = join(DIST, "_astro")
  return readdirSync(dir)
    .filter((file) => file.endsWith(".css"))
    .flatMap((file) => [...readFileSync(join(dir, file), "utf8").matchAll(/@import\s+(?:url\(\s*)?["']?([^"')\s;]+)/g)])
    .map((m) => ({ directive: "style-src", url: m[1], where: "CSS" }))
}

test("une seule CSP, celle de netlify.toml", () => {
  assert.equal(tomlPolicies.length, 1, "netlify.toml doit porter exactement une CSP")
  assert.doesNotMatch(readDistFile("_headers"), /^\s*Content-Security-Policy:/im, "CSP en double dans _headers")
})

test("la CSP autorise toutes les ressources externes du site", () => {
  const loads = [...loadPages().flatMap(pageLoads), ...cssImports()]
  const blocked = loads.filter(({ directive, url }) => !isAllowed(directive, url))
  const report = [...new Set(blocked.map((l) => `${l.directive} ${l.url.slice(0, 60)} (${l.where})`))]
  assert.deepEqual(report.slice(0, 10), [])
})

// Ressources que le build ne montre pas : la feuille Google Fonts charge ses
// polices, et le widget Calendly injecte sa propre feuille de style.
test("la CSP autorise les ressources chargées en cascade", () => {
  assert.ok(isAllowed("font-src", "https://fonts.gstatic.com/s/inter.woff2"))
  assert.ok(isAllowed("style-src", "https://assets.calendly.com/assets/external/widget.css"))
})

test("la CSP autorise les scripts en ligne que le site contient", () => {
  const executable = (s) => !s.getAttribute("src") && !/json/.test(s.getAttribute("type") ?? "")
  const hasInline = loadPages().some((page) => page.dom.querySelectorAll("script").some(executable))
  if (hasInline) assert.ok(sourcesFor(directives, "script-src").includes("'unsafe-inline'"))
})

test("la CSP interdit l'intégration du site dans un cadre et les plugins", () => {
  assert.deepEqual(directives.get("frame-ancestors"), ["'none'"])
  assert.deepEqual(directives.get("object-src"), ["'none'"])
})
