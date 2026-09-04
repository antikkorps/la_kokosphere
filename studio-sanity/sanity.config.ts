import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// Types affichés comme document unique (pas de liste, pas de bouton "créer")
const SINGLETONS = ['siteSettings']

export default defineConfig({
  name: 'default',
  title: 'La Kokosphere',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'j41wv78y',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Paramètres du site')
              .id('siteSettings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETONS.includes(item.getId() as string),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Empêche la création de plusieurs documents de paramètres
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({action}) => action !== 'unpublish' && action !== 'duplicate' && action !== 'delete')
        : input,
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
