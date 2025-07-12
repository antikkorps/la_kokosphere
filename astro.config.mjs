// @ts-check
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), sitemap(), vue()],
  site: "https://la-kokosphere.fr",
})
