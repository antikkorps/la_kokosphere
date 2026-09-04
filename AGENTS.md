# AGENTS.md

## Informations techniques pour les IA

### Structure du projet
- **Type**: Site Astro.js avec CMS Sanity
- **Framework principal**: Astro 5.x
- **CMS**: Sanity Studio (dossier `studio-sanity/`)
- **Styling**: TailwindCSS
- **Scripts**: Package.json racine + studio-sanity séparé

### Commandes principales
```bash
npm run dev          # Dev Astro
npm run studio       # Dev Sanity Studio
npm run dev:all      # Dev Astro + Studio (concurrently)
npm run build        # Build Astro
npm test             # Tests SEO sur le build (build préalable requis)
npm run test:ci      # Build puis tests, comme en CI
```

### Tests
Filet de sécurité issu de l'audit SEO d'août 2026, dans `tests/`. Les assertions
portent sur `dist/`, pas sur les sources : les régressions visées sont invisibles
à la compilation. Le site se construit très bien avec dix H1 par page ou un
sitemap qui pointe dans le vide.

### Architecture
- `/src/pages/` - Pages Astro
- `/src/layouts/` - Layouts de base
- `/src/components/` - Composants réutilisables
- `/public/` - Assets statiques
- `/studio-sanity/` - Configuration Sanity CMS

### Configuration importante
- Sanity packages dans `studio-sanity/` pas à la racine
- Site déployé via Astro build
- Studio séparé avec ses propres dépendances

### Notes de développement
- Toujours vérifier les versions Sanity local vs runtime
- Utiliser `npm run dev:all` pour développement complet
- Assets images dans `/public/images/`