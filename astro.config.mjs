// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import sanity from "@sanity/astro"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL || "https://votre-domaine-hypnotherapie.com",
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    sanity({
      projectId: import.meta.env.SANITY_PROJECT_ID || "votre-project-id",
      dataset: import.meta.env.SANITY_DATASET || "production",
      apiVersion: import.meta.env.SANITY_API_VERSION || "2024-01-01",
      useCdn: false,
    }),
  ],
})
