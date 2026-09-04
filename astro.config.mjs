// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(), 
    sitemap({
      // Configuration du sitemap
      // 'monthly' reflète la cadence réelle de publication : annoncer 'weekly'
      // sans la tenir dégrade la confiance accordée au sitemap.
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 45000,
      // Exclure certaines pages du sitemap
      filter: (page) => {
        return !page.includes('/admin') && 
               !page.includes('/_') && 
               !page.includes('/api/') &&
               !page.includes('/netlify/')
      }
    }), 
    vue()
  ],
  site: "https://la-kokosphere.fr",
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    // Tailwind 4 : plugin Vite, @astrojs/tailwind ne supporte pas Astro 6+
    plugins: [tailwindcss()],
    build: {
      // Une seule feuille de style partagée par tout le site : sans cela Astro
      // émettait deux fichiers contenant chacun l'intégralité de Tailwind,
      // soit ~165 Ko bloquant le rendu sur chaque page au lieu de ~87 Ko.
      cssCodeSplit: false,
      // manualChunks retiré : Astro 7 bundle avec Rolldown, qui n'accepte plus
      // la forme objet. Le découpage manuel n'apportait rien de toute façon —
      // @sanity/client ne part jamais au navigateur en statique.
    }
  }
})
