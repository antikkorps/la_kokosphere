import { test, describe } from "node:test"
import assert from "node:assert/strict"
import {
  loadPages,
  readDistFile,
  distFileExists,
  jsonLd,
  meta,
  internalRouteLinks,
} from "./helpers.js"

/**
 * Filet de sécurité issu de l'audit SEO d'août 2026.
 *
 * Chacune de ces assertions correspond à un défaut réellement constaté sur le
 * site en production. Elles portent sur le build, parce que ces régressions
 * sont invisibles à la compilation : le site se construit très bien avec dix
 * H1 par page ou un sitemap qui pointe dans le vide.
 */

const pages = loadPages()
const articles = pages.filter((page) => /^\/blog\/.+\//.test(page.url))

test("le build contient des pages et des articles", () => {
  assert.ok(pages.length > 10, `seulement ${pages.length} pages construites`)
  assert.ok(articles.length > 0, "aucun article de blog dans le build")
})

describe("hiérarchie des titres", () => {
  // Défaut E6 : jusqu'à dix H1 sur un même article, la hiérarchie sémantique
  // détruite et Google incapable d'identifier le sujet principal.
  for (const page of pages) {
    test(`${page.url} a exactement un h1`, () => {
      const count = page.dom.querySelectorAll("h1").length
      assert.equal(count, 1, `${count} balises h1`)
    })
  }
})

describe("liens internes", () => {
  // Défaut E3 : environ 380 redirections 301 internes, le site se renvoyant
  // lui-même vers la version avec slash final de chacune de ses pages.
  for (const page of pages) {
    test(`${page.url} ne pointe que vers des URLs finales`, () => {
      const sansSlash = internalRouteLinks(page).filter((href) => !href.endsWith("/"))
      assert.deepEqual(sansSlash, [], `liens redirigés : ${sansSlash.join(", ")}`)
    })
  }
})

describe("robots.txt", () => {
  const robots = readDistFile("robots.txt")

  // Défaut C1 : la ligne Disallow: /_astro/ cachait à Google 100 % des
  // feuilles de style et des scripts du site.
  test("ne bloque pas les ressources de rendu", () => {
    const bloquantes = robots
      .split("\n")
      .filter((ligne) => /^\s*Disallow:/i.test(ligne))
      .filter((ligne) => /_astro|\.css|\.js\b/i.test(ligne))
    assert.deepEqual(bloquantes, [], `Googlebot ne pourrait pas rendre le site : ${bloquantes}`)
  })

  test("déclare le sitemap généré par Astro", () => {
    assert.match(robots, /^Sitemap:\s*https:\/\/\S+\/sitemap-index\.xml\s*$/m)
    assert.doesNotMatch(robots, /Sitemap:.*\/sitemap\.xml/)
  })

  test("n'autorise pas de route inexistante", () => {
    // /services renvoyait 404 tout en étant explicitement autorisé
    for (const ligne of robots.split("\n").filter((l) => /^\s*Allow:/i.test(l))) {
      const chemin = ligne.replace(/^\s*Allow:\s*/i, "").trim().replace(/\*$/, "")
      if (chemin === "/" || chemin === "") continue
      const existe =
        distFileExists(chemin.replace(/^\//, "")) ||
        distFileExists(`${chemin.replace(/^\//, "").replace(/\/$/, "")}/index.html`)
      assert.ok(existe, `robots.txt autorise ${chemin}, qui n'existe pas dans le build`)
    }
  })
})

describe("sitemap", () => {
  // Défaut C2 : deux sitemaps concurrents, celui que Google lisait en priorité
  // listant 26 URLs dont 7 en 301, et en oubliant six.
  test("un seul sitemap, celui généré par Astro", () => {
    assert.ok(distFileExists("sitemap-index.xml"), "sitemap-index.xml absent du build")
    assert.ok(
      !distFileExists("sitemap.xml"),
      "sitemap.xml écrit à la main : il entre en concurrence avec celui d'Astro"
    )
  })

  test("ne liste que des URLs finales", () => {
    const locs = [...readDistFile("sitemap-0.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1]
    )
    assert.ok(locs.length > 10, `sitemap presque vide : ${locs.length} URLs`)

    const redirigees = locs.filter((url) => !new URL(url).pathname.endsWith("/"))
    assert.deepEqual(redirigees, [], `URLs qui redirigent : ${redirigees.join(", ")}`)
  })
})

describe("métadonnées", () => {
  const OG_TYPES_VALIDES = ["website", "article", "book", "profile"]
  // Métas ignorées par tous les moteurs, retirées lors de l'audit
  const OBSOLETES = ["revisit-after", "classification", "language", "keywords"]

  for (const page of pages) {
    test(`${page.url} porte un titre et une description exploitables`, () => {
      const titre = page.dom.querySelector("title")?.text?.trim()
      assert.ok(titre, "balise title absente")

      const description = meta(page, 'meta[name="description"]')
      assert.ok(description, "méta-description absente")
      // Au-delà d'environ 160 caractères, Google coupe la phrase en plein milieu
      assert.ok(
        description.length <= 160,
        `méta-description de ${description.length} caractères`
      )
      assert.doesNotMatch(description, /[\r\n]/, "retour à la ligne dans la description")
    })

    test(`${page.url} déclare un og:type valide`, () => {
      // /entreprise/ déclarait og:type="service", qui n'existe pas
      const type = meta(page, 'meta[property="og:type"]')
      assert.ok(OG_TYPES_VALIDES.includes(type), `og:type="${type}"`)
    })

    test(`${page.url} a une canonique`, () => {
      assert.ok(page.dom.querySelector('link[rel="canonical"]')?.getAttribute("href"))
    })

    test(`${page.url} ne porte plus de métas obsolètes`, () => {
      const restantes = OBSOLETES.filter((nom) => page.dom.querySelector(`meta[name="${nom}"]`))
      assert.deepEqual(restantes, [], `métas obsolètes : ${restantes.join(", ")}`)
    })
  }
})

describe("articles de blog", () => {
  // Défauts E1 et E2 : aucune donnée structurée de fraîcheur ni de paternité
  // sur le contenu éditorial, ce qui pèse sur l'E-E-A-T en santé.
  for (const article of articles) {
    test(`${article.url} est typé comme un article`, () => {
      assert.equal(meta(article, 'meta[property="og:type"]'), "article")
      assert.ok(
        meta(article, 'meta[property="article:published_time"]'),
        "article:published_time absent"
      )
    })

    test(`${article.url} porte un schema BlogPosting daté`, () => {
      const blogPosting = jsonLd(article).find((schema) => schema["@type"] === "BlogPosting")
      assert.ok(blogPosting, "aucun schema BlogPosting")
      for (const champ of ["headline", "datePublished", "author"]) {
        assert.ok(blogPosting[champ], `${champ} manquant dans le BlogPosting`)
      }
    })
  }
})

describe("données structurées", () => {
  test("tous les blocs JSON-LD sont désérialisables", () => {
    for (const page of pages) {
      assert.doesNotThrow(() => jsonLd(page), `JSON-LD invalide sur ${page.url}`)
    }
  })

  test("le LocalBusiness porte un logo et une image qui existent", () => {
    // Défaut E5 : logo pointant sur une favicon 16x16, image en 404
    const accueil = pages.find((page) => page.url === "/")
    const business = jsonLd(accueil).find((schema) =>
      String(schema["@type"]).includes("LocalBusiness")
    )
    assert.ok(business, "aucun schema LocalBusiness sur l'accueil")

    for (const valeur of [business.logo?.url ?? business.logo, business.image]) {
      assert.ok(valeur, "logo ou image absent du LocalBusiness")
      const chemin = new URL(valeur).pathname.replace(/^\//, "")
      assert.ok(distFileExists(chemin), `${chemin} référencé mais absent du build`)
    }

    // Google demande au moins 112x112 pour le panneau de connaissances
    assert.ok(business.logo?.width >= 112, "logo trop petit pour le panneau de connaissances")
  })
})

describe("dates", () => {
  // Défaut M2 : un article affichait « Jan 1, 1970 » aux visiteurs, faute de
  // date en base et à cause d'un repli sur new Date(0).
  for (const page of pages) {
    test(`${page.url} n'affiche pas de date à l'époque Unix`, () => {
      for (const time of page.dom.querySelectorAll("time[datetime]")) {
        assert.doesNotMatch(
          time.getAttribute("datetime"),
          /^1970-01-01/,
          "date de repli à l'époque Unix"
        )
      }
    })
  }
})

describe("feuilles de style", () => {
  // Défaut F1 : deux feuilles bloquant le rendu, contenant chacune
  // l'intégralité de Tailwind, soit environ 165 Ko par page.
  test("une seule feuille de style, partagée par toutes les pages", () => {
    const feuilles = new Set(
      pages.flatMap((page) =>
        page.dom
          .querySelectorAll('link[rel="stylesheet"]')
          .map((link) => link.getAttribute("href"))
          .filter((href) => href?.startsWith("/_astro/"))
      )
    )
    assert.equal(feuilles.size, 1, `${feuilles.size} feuilles distinctes : ${[...feuilles]}`)
  })
})
