import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join, relative } from "node:path"
import { parse } from "node-html-parser"

export const DIST = new URL("../dist/", import.meta.url).pathname

/**
 * Les tests portent sur le site construit, pas sur les sources : c'est le HTML
 * livré à Google qu'on veut protéger. Sans `dist/`, mieux vaut un message clair
 * qu'une cascade d'échecs incompréhensibles.
 */
export function requireDist() {
  if (!existsSync(DIST)) {
    throw new Error(
      "dist/ est absent. Lancez `npm run build` avant les tests, ou utilisez `npm run test:ci`."
    )
  }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

/** Toutes les pages HTML du build, avec leur DOM et leur URL publique. */
export function loadPages() {
  requireDist()

  return walk(DIST)
    .filter((file) => file.endsWith(".html"))
    .map((file) => {
      const html = readFileSync(file, "utf8")
      // dist/blog/mon-article/index.html -> /blog/mon-article/
      const url = `/${relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/")}`
      return { url, file, html, dom: parse(html) }
    })
    .sort((a, b) => a.url.localeCompare(b.url))
}

export function readDistFile(name) {
  requireDist()
  return readFileSync(join(DIST, name), "utf8")
}

export function distFileExists(name) {
  requireDist()
  return existsSync(join(DIST, name))
}

/** Les données structurées d'une page, déjà désérialisées. */
export function jsonLd(page) {
  return page.dom
    .querySelectorAll('script[type="application/ld+json"]')
    .map((script) => JSON.parse(script.rawText))
}

export function meta(page, selector) {
  return page.dom.querySelector(selector)?.getAttribute("content")
}

/**
 * Les routes internes du site. Sert à distinguer un lien de navigation, qui
 * doit porter un slash final, d'un fichier comme /rss.xml ou /favicon.png.
 */
export const ROUTES = [
  "about",
  "particuliers",
  "entreprise",
  "blog",
  "faq",
  "contact",
  "rendez-vous",
  "documents-legaux",
  "mentions-legales",
  "politique-confidentialite",
  "politique-conservation",
  "gerer-cookies",
  "testimonials",
  "admin",
]

/** Liens internes d'une page pointant vers une route, ancres et requêtes exclues. */
export function internalRouteLinks(page) {
  return page.dom
    .querySelectorAll("a[href]")
    .map((a) => a.getAttribute("href"))
    .filter((href) => href?.startsWith("/"))
    .map((href) => href.split(/[#?]/)[0])
    .filter((href) => ROUTES.includes(href.replace(/^\//, "").split("/")[0]))
}
