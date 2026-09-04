// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
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
    build: {
      // Une seule feuille de style partagée par tout le site : sans cela Astro
      // émettait deux fichiers contenant chacun l'intégralité de Tailwind,
      // soit ~165 Ko bloquant le rendu sur chaque page au lieu de ~87 Ko.
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          // Optimisation des chunks
          manualChunks: {
            'vue-vendor': ['vue', '@vue/reactivity', '@vue/runtime-core'],
            'sanity': ['@sanity/client', '@sanity/image-url']
          }
        }
      }
    }
  }
})
