// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL || "https://votre-domaine-hypnotherapie.com",
  integrations: [mdx(), sitemap(), tailwind()],
})
