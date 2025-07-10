# Guide de Déploiement - Site Hypnothérapie

Ce guide vous accompagne dans le déploiement de votre site web d'hypnothérapie.

## 🚀 Préparation au déploiement

### 1. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec vos informations :

```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer le fichier avec vos informations
nano .env
```

### 2. Personnalisation du contenu

Avant le déploiement, mettez à jour les informations dans `src/consts.ts` :

```typescript
export const SITE_TITLE = "Votre Nom - Hypnothérapeute"
export const SITE_DESCRIPTION = "Votre description personnalisée"
export const SITE_AUTHOR = "Votre Nom"
export const SITE_EMAIL = "votre-email@domaine.com"
export const SITE_PHONE = "+33 1 23 45 67 89"
export const SITE_ADDRESS = "Votre adresse de cabinet"
export const CALENDLY_URL = "https://calendly.com/votre-calendly"
```

### 3. Configuration du domaine

Mettez à jour `astro.config.mjs` avec votre domaine :

```javascript
export default defineConfig({
  site: "https://votre-domaine.com",
  // ... autres configurations
})
```

## 🌐 Déploiement sur Vercel (Recommandé)

### Étape 1 : Préparation

1. **Créer un compte Vercel** : [vercel.com](https://vercel.com)
2. **Connecter votre repository GitHub** :
   - Allez sur Vercel Dashboard
   - Cliquez sur "New Project"
   - Importez votre repository GitHub

### Étape 2 : Configuration

1. **Framework Preset** : Sélectionnez "Astro"
2. **Build Command** : `npm run build`
3. **Output Directory** : `dist`
4. **Install Command** : `npm install`

### Étape 3 : Variables d'environnement

Dans les paramètres du projet Vercel, ajoutez vos variables :

```env
SANITY_PROJECT_ID=votre-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
CALENDLY_URL=https://calendly.com/votre-calendly
SITE_URL=https://votre-domaine.com
```

### Étape 4 : Déploiement

1. **Déploiement automatique** : Chaque push sur la branche `main` déclenche un déploiement
2. **Domaines personnalisés** : Ajoutez votre domaine dans les paramètres Vercel
3. **SSL automatique** : Vercel gère automatiquement les certificats SSL

## 🌐 Déploiement sur Netlify

### Étape 1 : Préparation

1. **Créer un compte Netlify** : [netlify.com](https://netlify.com)
2. **Connecter votre repository** :
   - "New site from Git"
   - Sélectionnez votre repository

### Étape 2 : Configuration

```yaml
# netlify.toml (optionnel)
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Étape 3 : Variables d'environnement

Dans Netlify Dashboard > Site settings > Environment variables :

```env
SANITY_PROJECT_ID=votre-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
CALENDLY_URL=https://calendly.com/votre-calendly
SITE_URL=https://votre-domaine.com
```

## 🔧 Configuration de Sanity

### Étape 1 : Créer un projet Sanity

```bash
# Installer Sanity CLI
npm install -g @sanity/cli

# Créer un nouveau projet
sanity init

# Suivre les instructions :
# 1. Choisir "Create new project"
# 2. Nommer votre projet
# 3. Utiliser le dataset "production"
# 4. Choisir le template "Clean project with no predefined schemas"
```

### Étape 2 : Configuration du studio

1. **Créer les schémas** dans `schemas/` :
   - `post.js` pour les articles de blog
   - `service.js` pour les services
   - `testimonial.js` pour les témoignages

2. **Exemple de schéma** :

```javascript
// schemas/post.js
export default {
  name: "post",
  title: "Article",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "content",
      title: "Contenu",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
    },
  ],
}
```

### Étape 3 : Déployer le studio

```bash
# Déployer le studio Sanity
sanity deploy

# L'URL sera : https://votre-project.sanity.studio
```

### Étape 4 : Récupérer les informations de connexion

1. **Project ID** : Dans les paramètres du projet Sanity
2. **API Token** : Créer un token dans API > Tokens
3. **Dataset** : Généralement "production"

## 📅 Configuration de Calendly

### Étape 1 : Créer un compte

1. **Inscription** : [calendly.com](https://calendly.com)
2. **Choisir un plan** : Gratuit pour commencer

### Étape 2 : Configurer les types de rendez-vous

1. **Créer un Event Type** :
   - Nom : "Consultation Hypnothérapie"
   - Durée : 60 minutes
   - Description : Décrivez votre séance

2. **Paramètres avancés** :
   - Buffer time : 15 minutes avant/après
   - Questions personnalisées
   - Rappels automatiques

### Étape 3 : Récupérer l'URL d'intégration

1. **Aller dans Event Types**
2. **Cliquer sur votre événement**
3. **Copier l'URL** : `https://calendly.com/votre-username/consultation`

## 🔍 Configuration SEO

### Étape 1 : Google Search Console

1. **Ajouter votre propriété** : [search.google.com/search-console](https://search.google.com/search-console)
2. **Vérifier la propriété** : Via fichier HTML ou DNS
3. **Soumettre le sitemap** : `https://votre-domaine.com/sitemap-index.xml`

### Étape 2 : Google Analytics

1. **Créer un compte** : [analytics.google.com](https://analytics.google.com)
2. **Ajouter le tracking code** dans `BaseHead.astro` :

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag("js", new Date())
  gtag("config", "GA_MEASUREMENT_ID")
</script>
```

### Étape 3 : Balises Open Graph

Les balises Open Graph sont déjà configurées dans `BaseHead.astro` pour :

- Facebook et réseaux sociaux
- Twitter Cards
- LinkedIn

## 📧 Configuration Email (Optionnel)

### Étape 1 : Service SMTP

Recommandé : **SendGrid** ou **Mailgun**

1. **Créer un compte** sur le service choisi
2. **Configurer les variables** dans `.env` :

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre-api-key
```

### Étape 2 : Formulaire de contact

Le formulaire de contact est prêt à être connecté à un service comme :

- **Formspree** (gratuit)
- **Netlify Forms** (si déployé sur Netlify)
- **Vercel Functions** (si déployé sur Vercel)

## 🔒 Sécurité

### Étape 1 : Headers de sécurité

Ajoutez dans `astro.config.mjs` :

```javascript
export default defineConfig({
  // ... autres configurations
  server: {
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  },
})
```

### Étape 2 : Validation des formulaires

Les formulaires incluent déjà :

- Validation HTML5 côté client
- Protection CSRF (à implémenter selon le backend)

## 📱 Test post-déploiement

### Checklist de vérification

- [ ] **Pages principales** : Toutes les pages se chargent correctement
- [ ] **Responsive** : Test sur mobile, tablette, desktop
- [ ] **Formulaires** : Envoi et réception des messages
- [ ] **Calendly** : Widget fonctionne et redirige correctement
- [ ] **SEO** : Métadonnées et sitemap accessibles
- [ ] **Performance** : Score Lighthouse > 90
- [ ] **Accessibilité** : Test avec lecteur d'écran
- [ ] **Liens** : Tous les liens internes fonctionnent
- [ ] **Images** : Toutes les images se chargent
- [ ] **Analytics** : Tracking fonctionne

### Outils de test

- **Lighthouse** : [developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse)
- **GTmetrix** : [gtmetrix.com](https://gtmetrix.com)
- **PageSpeed Insights** : [pagespeed.web.dev](https://pagespeed.web.dev)

## 🚨 Dépannage

### Problèmes courants

1. **Build échoue** :
   - Vérifier les variables d'environnement
   - Contrôler les imports dans le code
   - Vérifier la version de Node.js

2. **Images ne se chargent pas** :
   - Vérifier les chemins dans `public/`
   - Contrôler les permissions des fichiers

3. **Calendly ne fonctionne pas** :
   - Vérifier l'URL dans les constantes
   - Contrôler les paramètres Calendly

4. **SEO ne fonctionne pas** :
   - Vérifier les métadonnées dans `BaseHead.astro`
   - Contrôler le sitemap généré

## 📞 Support

En cas de problème :

1. **Vérifier les logs** de déploiement
2. **Consulter la documentation** des services utilisés
3. **Contacter le support** technique si nécessaire

---

**Votre site est maintenant prêt à accueillir vos clients ! 🎉**
