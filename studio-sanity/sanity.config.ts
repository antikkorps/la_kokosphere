import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'La Kokosphere',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'j41wv78y',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  // Configuration pour l'upload d'images
  api: {
    cors: {
      credentials: 'include',
    },
  },

  // Configuration des assets avec support AVIF amélioré
  assets: {
    image: {
      // Formats supportés (inclure AVIF)
      formats: ['webp', 'jpg', 'jpeg', 'png', 'avif'],
      // Taille maximale (15MB pour être sûr)
      maxSize: 15 * 1024 * 1024,
      // Configuration simple pour AVIF
      accept: 'image/*',
    },
  },
})
